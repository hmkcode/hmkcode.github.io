---
layout: post
title:  "Android | Connecting to the Network Using HttpUrlConnection"
date:   2019-09-27 12:00:00
categories: android
post_url: http://hmkcode.com/android-network-connection-httpurlconnection/
pre_url: http://hmkcode.com/material-design-app-android-design-support-library-appcompat/
pre_title: "Building Material Design App Using Android Design Support Library and AppCompat Theme"
description: One common task for most Android apps is connecting to the Internet. Most network-connected Android apps use HTTP to send and receive data. This article shows you how to write a simple application that connects to the Internet, send HTTP GET request & display the response using Kotlin. 
---

![android-recyclerview-listadapter_files.png]({{ "http://hmkcode.github.io/images/android/android-http-async.png" 
| absolute_url }})

<p style="text-align: justify;">	
	One common task for most Android apps is connecting to the Internet. 
	Most network-connected Android apps use HTTP to send and receive data.
	This article shows you how to write a simple application that connects to the Internet, 
	send HTTP GET request & display the response.
	
</p>

### Objectives

- How to send HTTP GET request to a web server and display the response?
- How to check network connection?
- How to use AsyncTask to perform network operations on a separate thread?

	
### Environment &amp; Tools
_Tools used in this post_

- Android Studio 3.5
- Google Pixel 3
- Kotlin
- <a href='http://hmkcode-api.appspot.com/rest/api/hello/[NAME]'>http://hmkcode-api.appspot.com/rest/api/hello/[NAME]</a> this URL will return simple string **"Hello, [NAME]"**


## About this Sample App

We will build an app that send HTTP GET request and display the response.


## ( 1 ) Create new Android Project

- **Project Name:** android-http
- **Package Name:** com.hmkcode.http
- **Minimum SDK:** API 19: Android 4.4 (KitKat) 

## ( 2 ) Add Permissions 

- Add the following two lines to the `AndroidMainifest.xml` file


```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

> Starting with Android 9 (API level 28), cleartext support is disabled by default.

[cleartext traffic](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)

```xml
<application
        ...
        android:usesCleartextTraffic="true"
        ...
</application>
```

## ( 2 ) Design App Layout

- Add two **TextView** to `activity_main.xml` .
- First **TextView** for displaying network connection info.
- Second **TextView** to display message from server. 

![android-recyclerview-listadapter_files.png]({{ "http://hmkcode.github.io/images/android/android-http-async.png" 
| android-http }})


```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout ...>

    <TextView
        android:id="@+id/tvIsConnected"
        .../>

    <TextView
        android:id="@+id/tvResult"
        .../>
</LinearLayout>
```

## ( 3 ) Check the Network Connection

- Before making any network operation you need to check if you are connected or not.
- To check whether a network connection is available use **getActiveNetworkInfo()** and **isConnected()**.

```java
private fun checkNetworkConnection(): Boolean {
    val cm:ConnectivityManager =
        getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    val networkInfo:NetworkInfo? = cm.activeNetworkInfo
    val isConnected: Boolean = if(networkInfo != null) networkInfo.isConnected() else false

    if(isConnected){
        tvIsConnected.setText("Connected "+networkInfo?.typeName)
        tvIsConnected.setBackgroundColor(0xFF7CCC26.toInt())

    }else{
        tvIsConnected.setText("Not Connected!")
        tvIsConnected.setBackgroundColor(0xFFFF0000.toInt())
    }
    return isConnected;
}
```


## ( 4 ) Perform HTTP GET Request

- The simplest example for network operation is HTTP GET request.
- We create a new **URL** object by passing url string to the constructor.
- The **URL** object is used to establish an **HttpURLConnection**.
- Then, we execute the operation and receive the response as **InputStream**.
- Finally, we use helper method to convert **InputStream** to string. 

```java
private fun HttpGet(myURL: String?): String {

    val inputStream:InputStream
    val result:String

    // create URL
    val url:URL = URL(myURL)

    // create HttpURLConnection
    val conn:HttpURLConnection = url.openConnection() as HttpURLConnection

    // make GET request to the given URL
    conn.connect()

    // receive response as inputStream
    inputStream = conn.inputStream

    // convert inputstream to string
    if(inputStream != null)
        result = convertInputStreamToString(inputStream)
    else
        result = "Did not work!"
    
    return result
}
```

## ( 5 ) Perform Network Operations on a Separate Thread

- Network operation should always run on a seperate thread to avoid UI freeze.
- The **AsyncTask** class provides one of the simplest ways to create separate thread from the UI thread.
- Create an inner class extending **AsyncTask**.
- Override **doInBackground()** & **onPostExecute**.

```java
inner class HTTPAsyncTask : AsyncTask<String, Void, String>() {
    override fun doInBackground(vararg urls: String?): String {
        return HttpGet(urls[0])
    }
    override fun onPostExecute(result: String?) {
        tvResult.setText(result)
    }
}
```

## ( 6 ) Convert the InputStream to a String

- We will use a helper method to convert InputStream byte into String

```java
private fun convertInputStreamToString(inputStream: InputStream): String {
    val bufferedReader:BufferedReader? = BufferedReader(InputStreamReader(inputStream))
    var line:String? = bufferedReader?.readLine()
    var result:String = ""

    while (line != null) {
        result += line
        line = bufferedReader?.readLine()
    }

    inputStream.close()
    return result
}
```

### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-http/http-asynctask)

