---
layout: post
title:  "Android | Send JSON Content to the Cloud Using HttpUrlConnection & Kotlin Coroutine"
date:   2019-10-05 12:00:00
categories: 
description: Sending data to the cloud is a common task in mobile applications. Here we will consume an open REST service to practice sending data in JSON format to a cloud server. We will use HttpURLConnection to make an HTTP POST request to the server.  
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/android/android-post-json.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/android/android-post-json.png" alt="get-location" />
	</a>
	
	Sending data to the cloud is a common task in mobile applications. Here we will consume an open REST service to practice sending data in JSON format to a cloud server. We will use <b>HttpURLConnection</b> to make an HTTP POST request to the server. Then, we can verify that our request is successful by going to <a href="https://hmkcode-api.appspot.com/links.html">hmkcode-api.appspot.com/links.html</a> page.
	
</p>

#### Objectives

1. How to send HTTP POST request to the cloud with JSON content.
2. How to check network connection?
3. How to use kotlin coroutine to perform network operations on a separate thread?


### Environment, Tools &amp; Library
_used in this post_

- Android Studio 3.5.1
- `HttpURLConnection` client.
- REST service `http://hmkcode-api.appspot.com/rest/link/add` to post data.
- [https://hmkcode-api.appspot.com/links.html](https://hmkcode-api.appspot.com/links.html) to view our stored data.

## About the app

We are going to build a sample app that stores links info in the cloud. The app takes three inputs from the user link title, url and optional tags. When the user click send, the app will build a JSON object holding the three inputs, add the built JSON object to the POST request body and finally execute the POST request. 


## ( 1 ) Create new Android Project

Create new android application keep default options. 

- **Application Name:** post-json
- **Package Name:** com.hmkcode
- **Language:** Kotlin
- **Minimum SDK:** API 19: Android 4.4 (KitKat) 

## ( 2 ) Add Permissions


- Add the following two lines to the `AndroidMainifest.xml` file

```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## ( 3 ) Design App Layout


- Add the following views to `activity_main.xml`.
 - `TextView` for displaying network connection info.
 - Three `EditText` for title, URL & tags account.

![target_api]({{ "http://hmkcode.github.io/images/android/android-post-json-layout.png" | absolute_url }})


**activity_main.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout ...>
    <TextView
        android:id="@+id/tvIsConnected"
        ... />

    <com.google.android.material.textfield.TextInputLayout
        ...>
        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/etTitle"
            ...
            android:hint="Title..."/>
    </com.google.android.material.textfield.TextInputLayout>

    <com.google.android.material.textfield.TextInputLayout
       ...>
        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/etUrl"
            ...
            android:hint="example.com"/>
    </com.google.android.material.textfield.TextInputLayout>

    <com.google.android.material.textfield.TextInputLayout
        ...>
        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/etTags"
            ...
            android:hint="tag1;tag2;..."/>
    </com.google.android.material.textfield.TextInputLayout>

    <Button
        android:id="@+id/btnSend"
        android:text="Send"
        ...
        android:onClick="send"/>

    <TextView
        android:id="@+id/tvResult"
       .../>
</LinearLayout>
```

##### Dependencies

- You need to include the following dependencies to **build.gradle** 

**build.gradle (Module: post-json)**

```groovy
dependencies {
     implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'com.google.android.material:material:1.1.0-beta01'
    implementation 'androidx.core:core-ktx:1.1.0'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    // Coroutine
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.2"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.2"
    implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.2.0-alpha05"
}
```

## ( 4 ) Send JSON to Server 

`MainActivity.kt` is the only class where we need to code the following:

- a. Check network connectivity.
- b. Build `httpPost()` function with IO dispatcher.
- c. Build `send()` function to launch `httpPost()` in `lifecycleScope` coroutine scope. 

#### a. Check network connectivity

- Before making network operation check notwork connectivity status.
- To check network connectivity use **getActiveNetworkInfo()** & **isConnected()**.

	
```java
private fun checkNetworkConnection(): Boolean {
    val connMgr = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    val networkInfo = connMgr.activeNetworkInfo
    val isConnected: Boolean = if(networkInfo != null) networkInfo.isConnected() else false
    if (networkInfo != null && isConnected) {
        // show "Connected" & type of network "WIFI or MOBILE"
        tvIsConnected.text = "Connected " + networkInfo.typeName
        // change background color to red
        tvIsConnected.setBackgroundColor(-0x8333da)
    } else {
        // show "Not Connected"
        tvIsConnected.text = "Not Connected"
        // change background color to green
        tvIsConnected.setBackgroundColor(-0x10000)
    }
    return isConnected
}
```

#### b. Build `httpPost()` function with IO dispatcher.

- Create **httpPost(String url)** method 
- **httpPost()** method does the following:
  1. Use `withContext(Dispatcher.IO){}` to run code on IO thread.
  2. Creates `HttpURLConnection`
  3. Builds `JSONObject`
  4. Adds JSON content to POST request body
  5. executes the POST request
  6. returns response message
  
```java
Throws(IOException::class, JSONException::class)
    private suspend fun httpPost(myUrl: String): String {

        val result = withContext(Dispatchers.IO) {
            val url = URL(myUrl)
            // 1. create HttpURLConnection
            val conn = url.openConnection() as HttpsURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")

            // 2. build JSON object
            val jsonObject = buidJsonObject()

            // 3. add JSON content to POST request body
            setPostRequestContent(conn, jsonObject)

            // 4. make POST request to the given URL
            conn.connect()

            // 5. return response message
            conn.responseMessage + ""
        }
        return result
    }

}
	
```

#### c. Build `send()` function to launch `httpPost()` in `lifecycleScope` coroutine scope. 

- Launch coroutine using activity `lifecycleScope`. 
- Show the result on the `tvResult`

```java
 public fun send(view:View) {
        Toast.makeText(this, "Clicked", Toast.LENGTH_SHORT).show()
        // clear text result
        tvResult.setText("")

        if (checkNetworkConnection())
            lifecycleScope.launch {
                val result = httpPost("https://hmkcode-api.appspot.com/rest/link/add")
                tvResult.setText(result)
            }
        else
            Toast.makeText(this, "Not Connected!", Toast.LENGTH_SHORT).show()

    }
```




**MainActivity.java** complete code 

```java
package com.hmkcode
import android.content.Context
import android.net.ConnectivityManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONException
import org.json.JSONObject
import java.io.BufferedWriter
import java.io.IOException
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import javax.net.ssl.HttpsURLConnection

class MainActivity : AppCompatActivity() {

    lateinit var tvIsConnected: TextView
    lateinit var etTitle: EditText
    lateinit var etUrl: EditText
    lateinit var etTags: EditText
    lateinit var tvResult: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvIsConnected = findViewById<TextView>(R.id.tvIsConnected)
        etTitle = findViewById<EditText>(R.id.etTitle)
        etUrl = findViewById<EditText>(R.id.etUrl)
        etTags = findViewById<EditText>(R.id.etTags)
        tvResult = findViewById<TextView>(R.id.tvResult)
        checkNetworkConnection()
    }

    public fun send(view:View) {
        Toast.makeText(this, "Clicked", Toast.LENGTH_SHORT).show()
        // clear text result
        tvResult.setText("")

        if (checkNetworkConnection())
            lifecycleScope.launch {
                val result = httpPost("https://hmkcode-api.appspot.com/rest/link/add")
                tvResult.setText(result)
            }
        else
            Toast.makeText(this, "Not Connected!", Toast.LENGTH_SHORT).show()

    }

    @Throws(IOException::class, JSONException::class)
    private suspend fun httpPost(myUrl: String): String {

        val result = withContext(Dispatchers.IO) {
            val url = URL(myUrl)
            // 1. create HttpURLConnection
            val conn = url.openConnection() as HttpsURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")

            // 2. build JSON object
            val jsonObject = buidJsonObject()

            // 3. add JSON content to POST request body
            setPostRequestContent(conn, jsonObject)

            // 4. make POST request to the given URL
            conn.connect()

            // 5. return response message
            conn.responseMessage + ""
        }
        return result
    }

    private fun checkNetworkConnection(): Boolean {
        val connMgr = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

        val networkInfo = connMgr.activeNetworkInfo
        val isConnected: Boolean = if(networkInfo != null) networkInfo.isConnected() else false
        if (networkInfo != null && isConnected) {
            // show "Connected" & type of network "WIFI or MOBILE"
            tvIsConnected.text = "Connected " + networkInfo.typeName
            // change background color to red
            tvIsConnected.setBackgroundColor(-0x8333da)
        } else {
            // show "Not Connected"
            tvIsConnected.text = "Not Connected"
            // change background color to green
            tvIsConnected.setBackgroundColor(-0x10000)
        }
        return isConnected
    }

    @Throws(JSONException::class)
    private fun buidJsonObject(): JSONObject {

        val jsonObject = JSONObject()
        jsonObject.accumulate("title", etTitle.getText().toString())
        jsonObject.accumulate("url", etUrl.getText().toString())
        jsonObject.accumulate("tags", etTags.getText().toString())

        return jsonObject
    }

    @Throws(IOException::class)
    private fun setPostRequestContent(conn: HttpURLConnection, jsonObject: JSONObject) {

        val os = conn.outputStream
        val writer = BufferedWriter(OutputStreamWriter(os, "UTF-8"))
        writer.write(jsonObject.toString())
        Log.i(MainActivity::class.java.toString(), jsonObject.toString())
        writer.flush()
        writer.close()
        os.close()
    }
}
```

## (5) Run & Check 

- Run the app
- Enter title, URL & tags.
- Click Send
- Visit [http://hmkcode-api.appspot.com/link.html](http://hmkcode-api.appspot.com/links.html) to check 


### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-http/post-json)

