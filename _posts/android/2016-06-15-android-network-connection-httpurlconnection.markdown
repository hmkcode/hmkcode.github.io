---
layout: post
title:  "Android | Connecting to the Network Using HttpUrlConnection"
date:   2016-06-15 13:32:00
categories: android
post_url: http://hmkcode.com/android-network-connection-httpurlconnection/
pre_url: http://hmkcode.com/material-design-app-android-design-support-library-appcompat/
pre_title: "Building Material Design App Using Android Design Support Library and AppCompat Theme"
description: One common task for most Android apps is connecting to the Internet. Most network-connected Android apps use HTTP to send and receive data. This article shows you how to write a simple application that connects to the Internet, send HTTP GET request & display the response. 
---
<p style="text-align: justify;">
	<a href="http://hmkcode.com/wp-content/uploads/2013/09/android-http-get_2.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.com/wp-content/uploads/2013/09/android-http-get_2.png" alt="get-location" />
	</a>
	<br/>
	One common task for most Android apps is connecting to the Internet. 
	Most network-connected Android apps use HTTP to send and receive data.
	This article shows you how to write a simple application that connects to the Internet, 
	send HTTP GET request & display the response.
	
</p>

#### Objectives

- How to send HTTP GET request to a web server and display the response?
- How to check network connection?
- How to use AsyncTask to perform network operations on a separate thread?

	
#### Environment &amp; Tools
_Tools used in this post_

- Windows 8
- Android Studio 2.1.2
- Nexus 5
- <a href='http://hmkcode.com/examples/index.php'>http://hmkcode.com/examples/index.php</a> this URL will return simple string **"HMKCODE HTTP Example"**


## About this Sample App

We will build an app that send HTTP GET request and display the response.


#### ( 1 ) Create new Android Project

- **Application Name:** android-http
- **Package Name:** com.hmkcode.android.http
- **Minimum SDK:** API 8: Android 2.2 (Froyo) 

#### ( 2 ) Add Permissions 

- Add the following two lines to the `AndroidMainifest.xml` file

<pre style='color:#000000;background:#f1f0f0;'>
	<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>uses-permission</span> <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>name</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>android.permission.INTERNET</span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>/></span>
	<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>uses-permission</span> <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>name</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>android.permission.ACCESS_NETWORK_STATE</span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>/></span>
</pre>

#### ( 3 ) Design App Layout

- Add two **TextView** to `activity_main.xml` .
- First **TextView** for displaying network connection info.
- Second **TextView** to display message from server. 

<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/2016/06/hmkcode-android-http.png" alt="android-http" />

<pre style='color:#000000;background:#f1f0f0;'>
<span style='color:#004a43; '>&lt;?</span><span style='color:#800000; font-weight:bold; '>xml</span><span style='color:#004a43; '> </span><span style='color:#074726; '>version</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#7d0045; '>1.0</span><span style='color:#800000; '>"</span><span style='color:#004a43; '> </span><span style='color:#074726; '>encoding</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>utf-8</span><span style='color:#800000; '>"</span><span style='color:#004a43; '>?></span>
<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>LinearLayout</span> <span style='color:#666616; '>xmlns</span><span style='color:#800080; '>:</span><span style='color:#074726; '>android</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#666616; '>http</span><span style='color:#800080; '>:</span><span style='color:#800000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/apk/res/android</span><span style='color:#800000; '>"</span>
    <span style='color:#666616; '>xmlns</span><span style='color:#800080; '>:</span><span style='color:#074726; '>tools</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#666616; '>http</span><span style='color:#800080; '>:</span><span style='color:#800000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/tools</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_width</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_height</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>paddingBottom</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>@dimen/activity_vertical_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>paddingLeft</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>@dimen/activity_horizontal_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>paddingRight</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>@dimen/activity_horizontal_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>paddingTop</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>@dimen/activity_vertical_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>orientation</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>vertical</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>tools</span><span style='color:#800080; '>:</span><span style='color:#274796; '>context</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>com.hmkcode.android.http.MainActivity</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>></span>



    <span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>TextView</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>id</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>@+id/tvIsConnected</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_width</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>wrap_content</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_height</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>wrap_content</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_gravity</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>center</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>background</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>#FF0000</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>textColor</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>#FFF</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>textSize</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>18dp</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>padding</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>5dp</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_marginBottom</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>5dp</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>text</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>is connected? </span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>/></span>

    <span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>TextView</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>id</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>@+id/tvResult</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_width</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>wrap_content</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_height</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>wrap_content</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_gravity</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>center</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>background</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>#ffffff</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>textColor</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>#000</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>textSize</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>18dp</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>padding</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>5dp</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_marginBottom</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>5dp</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>text</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>/></span>
<span style='color:#a65700; '>&lt;/</span><span style='color:#5f5035; '>LinearLayout</span><span style='color:#a65700; '>></span>
</pre>

#### ( 4 ) Check the Network Connection

- Before making any network operation you need to check if you are connected or not.
- To check whether a network connection is available use **getActiveNetworkInfo()** and **isConnected()**.

{% highlight java %}
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
{% endhighlight %}

#### ( 5 ) Perform HTTP GET Request

- The simplest example for network operation is HTTP GET request.
- We create a new **URL** object by passing url string to the constructor.
- The **URL** object is used to establish an **HttpURLConnection**.
- Then, we execute the operation and receive the response as **InputStream**.
- Finally, we use helper method to convert **InputStream** to string. 

<pre style='color:#000000;background:#f1f0f0;'>
<span style='color:#800000; font-weight:bold; '>private</span> String HttpGet(String myUrl) <span style='color:#800000; font-weight:bold; '>throws</span> IOException <span style='color:#800080; '>{</span>
      <span style='color:#bb7977; font-weight:bold; '>InputStream</span> inputStream <span style='color:#808030; '>=</span> <span style='color:#800000; font-weight:bold; '>null</span><span style='color:#800080; '>;</span>
      <span style='color:#bb7977; font-weight:bold; '>String</span> result <span style='color:#808030; '>=</span> <span style='color:#0000e6; '>""</span><span style='color:#800080; '>;</span>

          <span style='color:#bb7977; font-weight:bold; '>URL</span> url <span style='color:#808030; '>=</span> <span style='color:#800000; font-weight:bold; '>new</span> <span style='color:#bb7977; font-weight:bold; '>URL</span><span style='color:#808030; '>(</span>myUrl<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>

          <span style='color:#696969; '>// create HttpURLConnection</span>
          <span style='color:#bb7977; font-weight:bold; '>HttpURLConnection</span> conn <span style='color:#808030; '>=</span> <span style='color:#808030; '>(</span><span style='color:#bb7977; font-weight:bold; '>HttpURLConnection</span><span style='color:#808030; '>)</span> url<span style='color:#808030; '>.</span>openConnection<span style='color:#808030; '>(</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>

          <span style='color:#696969; '>// make GET request to the given URL</span>
          conn<span style='color:#808030; '>.</span>connect<span style='color:#808030; '>(</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>

          <span style='color:#696969; '>// receive response as inputStream</span>
          inputStream <span style='color:#808030; '>=</span> conn<span style='color:#808030; '>.</span>getInputStream<span style='color:#808030; '>(</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>

          <span style='color:#696969; '>// convert inputstream to string</span>
          <span style='color:#800000; font-weight:bold; '>if</span><span style='color:#808030; '>(</span>inputStream <span style='color:#808030; '>!</span><span style='color:#808030; '>=</span> <span style='color:#800000; font-weight:bold; '>null</span><span style='color:#808030; '>)</span>
              result <span style='color:#808030; '>=</span> convertInputStreamToString<span style='color:#808030; '>(</span>inputStream<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
          <span style='color:#800000; font-weight:bold; '>else</span>
              result <span style='color:#808030; '>=</span> <span style='color:#0000e6; '>"Did not work!"</span><span style='color:#800080; '>;</span>

      <span style='color:#800000; font-weight:bold; '>return</span> result<span style='color:#800080; '>;</span>
  <span style='color:#800080; '>}</span>
</pre>

## ( 5 ) Perform Network Operations on a Separate Thread

- Network operation should always run on a seperate thread to avoid UI freeze.
- The **AsyncTask** class provides one of the simplest ways to create separate thread from the UI thread.
- Create an inner class extending **AsyncTask**.
- Override **doInBackground()** & **onPostExecute**.

<pre style='color:#000000;background:#f1f0f0;'>
<span style='color:#800000; font-weight:bold; '>private</span> <span style='color:#800000; font-weight:bold; '>class</span> HTTPAsyncTask <span style='color:#800000; font-weight:bold; '>extends</span> AsyncTask&lt;String, Void, String> <span style='color:#800080; '>{</span>
      <span style='color:#808030; '>@</span>Override
      <span style='color:#800000; font-weight:bold; '>protected</span> <span style='color:#bb7977; font-weight:bold; '>String</span> doInBackground<span style='color:#808030; '>(</span><span style='color:#bb7977; font-weight:bold; '>String</span><span style='color:#808030; '>.</span><span style='color:#808030; '>.</span><span style='color:#808030; '>.</span> urls<span style='color:#808030; '>)</span> <span style='color:#800080; '>{</span>

          <span style='color:#696969; '>// params comes from the execute() call: params[0] is the url.</span>
          <span style='color:#800000; font-weight:bold; '>try</span> <span style='color:#800080; '>{</span>
              <span style='color:#800000; font-weight:bold; '>return</span> HttpGet<span style='color:#808030; '>(</span>urls<span style='color:#808030; '>[</span><span style='color:#008c00; '>0</span><span style='color:#808030; '>]</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
          <span style='color:#800080; '>}</span> <span style='color:#800000; font-weight:bold; '>catch</span> <span style='color:#808030; '>(</span><span style='color:#bb7977; font-weight:bold; '>IOException</span> e<span style='color:#808030; '>)</span> <span style='color:#800080; '>{</span>
              <span style='color:#800000; font-weight:bold; '>return</span> <span style='color:#0000e6; '>"Unable to retrieve web page. URL may be invalid."</span><span style='color:#800080; '>;</span>
          <span style='color:#800080; '>}</span>
      <span style='color:#800080; '>}</span>
      <span style='color:#696969; '>// onPostExecute displays the results of the AsyncTask.</span>
      <span style='color:#808030; '>@</span>Override
      <span style='color:#800000; font-weight:bold; '>protected</span> <span style='color:#bb7977; '>void</span> onPostExecute<span style='color:#808030; '>(</span><span style='color:#bb7977; font-weight:bold; '>String</span> result<span style='color:#808030; '>)</span> <span style='color:#800080; '>{</span>
          tvResult<span style='color:#808030; '>.</span>setText<span style='color:#808030; '>(</span>result<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
      <span style='color:#800080; '>}</span>
  <span style='color:#800080; '>}</span>
</pre>

## ( 6 ) Convert the InputStream to a String

- We will use a helper method to convert InputStream byte into String


<pre style='color:#000000;background:#f1f0f0;'>
<span style='color:#800000; font-weight:bold; '>private</span> <span style='color:#800000; font-weight:bold; '>static</span> String convertInputStreamToString(InputStream inputStream) <span style='color:#800000; font-weight:bold; '>throws</span> IOException<span style='color:#800080; '>{</span>
          <span style='color:#bb7977; font-weight:bold; '>BufferedReader</span> bufferedReader <span style='color:#808030; '>=</span> <span style='color:#800000; font-weight:bold; '>new</span> <span style='color:#bb7977; font-weight:bold; '>BufferedReader</span><span style='color:#808030; '>(</span> <span style='color:#800000; font-weight:bold; '>new</span> <span style='color:#bb7977; font-weight:bold; '>InputStreamReader</span><span style='color:#808030; '>(</span>inputStream<span style='color:#808030; '>)</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
          <span style='color:#bb7977; font-weight:bold; '>String</span> line <span style='color:#808030; '>=</span> <span style='color:#0000e6; '>""</span><span style='color:#800080; '>;</span>
          <span style='color:#bb7977; font-weight:bold; '>String</span> result <span style='color:#808030; '>=</span> <span style='color:#0000e6; '>""</span><span style='color:#800080; '>;</span>
          <span style='color:#800000; font-weight:bold; '>while</span><span style='color:#808030; '>(</span><span style='color:#808030; '>(</span>line <span style='color:#808030; '>=</span> bufferedReader<span style='color:#808030; '>.</span>readLine<span style='color:#808030; '>(</span><span style='color:#808030; '>)</span><span style='color:#808030; '>)</span> <span style='color:#808030; '>!</span><span style='color:#808030; '>=</span> <span style='color:#800000; font-weight:bold; '>null</span><span style='color:#808030; '>)</span>
              result <span style='color:#808030; '>+</span><span style='color:#808030; '>=</span> line<span style='color:#800080; '>;</span>

          inputStream<span style='color:#808030; '>.</span>close<span style='color:#808030; '>(</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
          <span style='color:#800000; font-weight:bold; '>return</span> result<span style='color:#800080; '>;</span>

      <span style='color:#800080; '>}</span>
</pre>

### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-http)

