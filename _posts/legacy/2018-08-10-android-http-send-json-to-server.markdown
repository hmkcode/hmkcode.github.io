---
layout: post
title:  "Android | Send JSON Content to Server Using Http Post"
date:   2018-08-10 12:00:00
categories: 
description: Sending data to the cloud is a common task. Here we will consume an open REST service to practice sending data to the server in JSON format. We will use HttpURLConnection to POST JSON data to the server.  
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/android/android-post-json.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/android/android-post-json.png" alt="get-location" />
	</a>
	
	Sending data to the cloud is a common task. Here we will consume an open REST service to practice sending data to the server in JSON format . We will use <b>HttpURLConnection</b> to POST JSON data to the server. Then, we can verify that our request is successful by going to this <a href="http://hmkcode.appspot.com/post-json/index.html">page</a>.
	
</p>

#### Objectives

1. How to send HTTP POST request to the cloud with JSON content.
2. How to check network connection?
3. How to use AsyncTask to perform network operations on a separate thread?


### Environment, Tools &amp; Library
_used in this post_

- Android Studio 3.1.4
- `HttpURLConnection` client.
- REST service `http://hmkcode.appspot.com/jsonservlet`


## ( 1 ) Create new Android Project

Create new android application keep default options. 
This app is targeting API 19 or later

![target_api]({{ "http://hmkcode.github.io/images/android/target_android_devices_19_later.jpg" | absolute_url }})

## ( 2 ) Add Permissions


- Add the following two lines to the `AndroidMainifest.xml` file

```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## ( 3 ) Design App Layout


- Add the following views to `activity_main.xml`.
 - `TextView` for displaying network connection info.
 - Three `EditText` for name, country & twitter account.

![target_api]({{ "http://hmkcode.github.io/images/android/android-post-json-layout.png" | absolute_url }})


**activity_main.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout ...>

    <TextView android:id="@+id/tvIsConnected" .../>

    <android.support.design.widget.TextInputLayout android:id="@+id/tilName" ...>
        <EditText android:id="@+id/etName" />
    </android.support.design.widget.TextInputLayout>

    <android.support.design.widget.TextInputLayout android:id="@+id/tilCountry" ...>
        <EditText android:id="@+id/etCountry" .../>
    </android.support.design.widget.TextInputLayout>

    <android.support.design.widget.TextInputLayout android:id="@+id/tilTwitter" ...>
        <EditText android:id="@+id/etTwitter" .../>
    </android.support.design.widget.TextInputLayout>

	<Button
        android:id="@+id/btnSend"
        android:text="Send" 
		android:onClick="send" ... />
		
    <TextView android:id="@+id/tvResult" .../>
</LinearLayout>
```

##### Design Support Library

> You need to include **[Design Support Library](https://developer.android.com/topic/libraries/support-library/packages#design)** to the dependencies in the app build file `build.gradle`. 
> The Design Support library adds support for various material design components such as **TextInputLayout**

**build.gradle (app)**

```groovy
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'com.android.support:appcompat-v7:27.1.1'
    implementation 'com.android.support.constraint:constraint-layout:1.1.2'
    implementation 'com.android.support:design:27.1.1'  
    testImplementation 'junit:junit:4.12'
    androidTestImplementation 'com.android.support.test:runner:1.0.2'
    androidTestImplementation 'com.android.support.test.espresso:espresso-core:3.0.2'
}
```

## ( 4 ) Send JSON to Server 

`MainActivity.java` is the only Java class where we need to code the following:

- a. Check network connectivity.
- b. Create a separate thread to perform HTTP request using `AsyncTask`.
- c. Build HTTP POST request.

#### a. Check network connectivity

- Before making network operation check notwork connectivity status.
- To check network connectivity use **getActiveNetworkInfo()** & **isConnected()**.

	
```java
 public boolean checkNetworkConnection() {
        ConnectivityManager connMgr = (ConnectivityManager)
                getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        boolean isConnected = false;
        if (networkInfo != null && (isConnected = networkInfo.isConnected())) {
            // show "Connected" & type of network "WIFI or MOBILE"
            tvIsConnected.setText("Connected "+networkInfo.getTypeName());
            // change background color to red
            tvIsConnected.setBackgroundColor(0xFF7CCC26);


        } else {
            // show "Not Connected"
            tvIsConnected.setText("Not Connected");
            // change background color to green
            tvIsConnected.setBackgroundColor(0xFFFF0000);
        }

        return isConnected;
    }
```

#### b. Create a separate thread to perform HTTP request using `AsyncTask`

- Run network operation on a seperate thread to avoid UI freeze.
- The `AsyncTask` class provides one of the simplest ways to create separate thread from the UI thread.
- Create an inner class extending `AsyncTask`.
- Override **doInBackground()** & **onPostExecute**.

```java

	private class HTTPAsyncTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            // params comes from the execute() call: params[0] is the url.
            try {
                try {
                    return HttpPost(urls[0]);
                } catch (JSONException e) {
                    e.printStackTrace();
                    return "Error!";
                }
            } catch (IOException e) {
                return "Unable to retrieve web page. URL may be invalid.";
            }
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {
            tvResult.setText(result);
        }
    }
	
```

#### c. Build HTTP POST request.

- Create **httpPost(String url)** method 
- **httpPost()** method does the following:
  1. Creates `HttpURLConnection`
  2. Builds `JSONObject`
  3. Adds JSON content to POST request body
  4. executes the POST request
  5. returns response message
  
```java

private String HttpPost(String myUrl) throws IOException, JSONException {
        String result = "";

        URL url = new URL(myUrl);

        // 1. create HttpURLConnection
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");

        // 2. build JSON object
        JSONObject jsonObject = buidJsonObject();

        // 3. add JSON content to POST request body
        setPostRequestContent(conn, jsonObject);

        // 4. make POST request to the given URL
        conn.connect();

        // 5. return response message
        return conn.getResponseMessage()+"";

}
	
```


**MainActivity.java** complete code 

```java
package com.hmkcode;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    TextView tvIsConnected;
    EditText etName;
    EditText etCountry;
    EditText etTwitter;
    TextView tvResult;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        tvIsConnected = (TextView) findViewById(R.id.tvIsConnected);
        etName = findViewById(R.id.etName);
        etCountry = findViewById(R.id.etCountry);
        etTwitter = findViewById(R.id.etTwitter);
        tvResult = (TextView) findViewById(R.id.tvResult);
        checkNetworkConnection();



    }

    // check network connection
    public boolean checkNetworkConnection() {
        ConnectivityManager connMgr = (ConnectivityManager)
                getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        boolean isConnected = false;
        if (networkInfo != null && (isConnected = networkInfo.isConnected())) {
            // show "Connected" & type of network "WIFI or MOBILE"
            tvIsConnected.setText("Connected "+networkInfo.getTypeName());
            // change background color to red
            tvIsConnected.setBackgroundColor(0xFF7CCC26);


        } else {
            // show "Not Connected"
            tvIsConnected.setText("Not Connected");
            // change background color to green
            tvIsConnected.setBackgroundColor(0xFFFF0000);
        }

        return isConnected;
    }


    private String httpPost(String myUrl) throws IOException, JSONException {
        String result = "";

        URL url = new URL(myUrl);

        // 1. create HttpURLConnection
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");

        // 2. build JSON object
        JSONObject jsonObject = buidJsonObject();

        // 3. add JSON content to POST request body
        setPostRequestContent(conn, jsonObject);

        // 4. make POST request to the given URL
        conn.connect();

        // 5. return response message
        return conn.getResponseMessage()+"";

    }


    private class HTTPAsyncTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            // params comes from the execute() call: params[0] is the url.
            try {
                try {
                    return httpPost(urls[0]);
                } catch (JSONException e) {
                    e.printStackTrace();
                    return "Error!";
                }
            } catch (IOException e) {
                return "Unable to retrieve web page. URL may be invalid.";
            }
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {
            tvResult.setText(result);
        }
    }


    public void send(View view) {
        Toast.makeText(this, "Clicked", Toast.LENGTH_SHORT).show();
        // perform HTTP POST request
        if(checkNetworkConnection())
            new HTTPAsyncTask().execute("http://hmkcode.appspot.com/jsonservlet");
        else
            Toast.makeText(this, "Not Connected!", Toast.LENGTH_SHORT).show();

    }

    private JSONObject buidJsonObject() throws JSONException {

        JSONObject jsonObject = new JSONObject();
        jsonObject.accumulate("name", etName.getText().toString());
        jsonObject.accumulate("country",  etCountry.getText().toString());
        jsonObject.accumulate("twitter",  etTwitter.getText().toString());

        return jsonObject;
    }

    private void setPostRequestContent(HttpURLConnection conn, JSONObject jsonObject) throws IOException {

        OutputStream os = conn.getOutputStream();
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
        writer.write(jsonObject.toString());
        Log.i(MainActivity.class.toString(), jsonObject.toString());
        writer.flush();
        writer.close();
        os.close();
    }

}
```

## (5) Run & Check 

- Run the app
- Enter name, country & twitter.
- Click Send
- Visit [http://hmkcode.appspot.com/post-json/index.html](http://hmkcode.appspot.com/post-json/index.html) to check 

![java-post-json-run]({{ "http://hmkcode.github.io/images/android/android-post-json-run.png" | absolute_url }})

### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-post-json)

