---
layout: post
title:  "Android | Using Kotlin Coroutine to Perform HTTP Request using HttpUrlConnection"
date:   2019-10-03 12:00:00
categories: android
post_url: http://hmkcode.com/android-network-connection-httpurlconnection/
pre_url: http://hmkcode.com/android/android-network-connection-httpurlconnection/
description: Long-running task such as CPU intensive work, writing a file to disk or network request should NOT run on the main thread. Android, for example, will throw a NetworkOnMainThreadException if you try to perform an HTTP reqeust on the main thread. To resolve this issue, we can use Kotlin coroutine to perform long-running task on a separate thread. This post shows how to perform a non-blocking HTTP reqest using HttpUrlConnection and Kotlin coroutine.
---

![android-recyclerview-listadapter_files.png]({{ "http://hmkcode.github.io/images/android/android-http-async.png" 
| absolute_url }})

<p style="text-align: justify;">	
	Long-running task such as CPU intensive work, writing a file to disk or network request should NOT run on the main thread. Android, for example, will throw a NetworkOnMainThreadException if you try to perform an HTTP reqeust on the main thread. To resolve this issue, we can use Kotlin coroutine to perform long-running task on a separate thread. This post shows how to perform a non-blocking HTTP reqest using HttpUrlConnection and Kotlin coroutine.
	
</p>

### Objectives

- What is coroutine?
- Why using coroutine?
- How to use coroutine to perform network reqeust? 

	
### Environment &amp; Tools
_Tools used in this post_

- Android Studio 3.5
- Google Pixel 3
- Kotlin 1.3.50
- <a href='http://hmkcode-api.appspot.com/rest/api/hello/[NAME]'>http://hmkcode-api.appspot.com/rest/api/hello/[NAME]</a> this URL will return simple string **"Hello, [NAME]"**

## What is Coroutine?

**Coroutine** is a feature of **Kotlin** that enables  you to write asynchronous _sequential_ code to manage long-running task in background threads. 

For example, coroutine will allow you to write sequential code to make an HTTP request. 

![android-sequential-coroutine.png]({{ "http://hmkcode.github.io/images/android/android-sequential-coroutine.png" 
| absolute_url }})

## Why Using Coroutine?

Long-running tasks such as CPU intensive work, network requests, and disk IO should not run on main thread. Running such tasks on main thread may block UI interactions. However, running network request on the main thread is prevented by Android SDK. Android will throw an exception if we try to make an HTTP request on the main thread.




## How to use coroutine to perform network reqeust? 

> In a previous post [Connecting to the Network Using HttpUrlConnection](http://hmkcode.com/android/android-network-connection-httpurlconnection/), I explained how to perform HTTP GET reqeust using `HttpUrlConnection` and `AsyncTask` on an Android app. Here we will replace `AsyncTask` with **coroutine** to perform the same task. 




##  HTTP GET Request

- The simplest example for network operation is HTTP GET request.
- We create a new **URL** object by passing url string to the constructor.
- The **URL** object is used to establish an **HttpURLConnection**.
- Then, we execute the operation and receive the response as **InputStream**.
- Finally, we use helper method to convert **InputStream** to string. 

```java
private fun httpGet(myURL: String?): String {

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

## Perform Network Operations on a Separate Thread Using AsyncTask

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

- Now, we can execute the HTTP request as following

```java
HTTPAsyncTask().execute("http://hmkcode-api.appspot.com/rest/api/hello/Android")
```

## Perform Network Operations on a Separate Thread Using Coroutine

### Meet `suspend`

`suspend` is a reserved keyword in Kotlin that makes a function available to coroutines. Function marked with `suspend` suspends execution until the result is returned. While waiting for the result, it unblocks the thread that it's running on so other functions or coroutines can run.


```java
private suspend fun httpGet(myURL: String?): String? {...}

```

> The suspend keyword doesn't specify the thread code runs on. Suspend functions may run on a background thread or the main thread.


### Dispatcher 
- Dispatcher controls which thread runs a coroutine.
- There are three dispatcher `Default`, `IO` & `Main`

We will run our suspend function on IO thread using `withContext(Dispatchers.IO)` 

```java
private suspend fun httpGet(myURL: String?): String? {

        val result = withContext(Dispatchers.IO) {
           
           // HTTP GET request code... 

        }
        return result
    }
```

### Coroutine Scope

- Coroutines run inside a [CoroutineScope](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.experimental/-coroutine-scope/)
- A scope controls the lifetime of coroutines.
- We can use `GlobalScope` to `launch` our coroutine.


> **GlobalScope** is a good default for launching work in background, however it is not recommend using **GlobalScope**. 

We will launch the coroutine using `GlobalScope`

```java
GlobalScope.launch(Dispatchers.Main) {
                val result = httpGet("http://hmkcode-api.appspot.com/rest/api/hello/Android")
                tvResult.setText(result)
            }
```            

- We can replace `GlobalScope` with [`LifecycleScope`](https://developer.android.com/topic/libraries/architecture/coroutines#lifecyclescope).
- `LifecycleScope` is one of the three built-in coroutine scopes in the [architecture components](https://developer.android.com/topic/libraries/architecture) contained in the [KTX extensions](https://developer.android.com/kotlin/ktx).

Add the dependency below to use this scope.

```groovy
 implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.2.0-alpha05"
```

Now, you can use 'lifecycleScope' to launch the coroutine

```java
 lifecycleScope.launch {
                val result = httpGet("http://hmkcode-api.appspot.com/rest/api/hello/Android")
                tvResult.setText(result)
            }
```

### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-http/http-coroutine)

