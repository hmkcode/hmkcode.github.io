---
layout: post
title:  "Android | Monitor Network Connectivity Using ConnectivityManager.NetworkCallback"
date:   2019-10-07 12:00:00
categories: android

description: ConnectivityManager class can be used to answer queries about network connectivity status. It can also notifiy applications when network connectivity status changes using NetworkCallback.
---

![android-recyclerview-listadapter_files.png]({{ "/images/android/android-network-connectivity.gif" 
| absolute_url }})


`ConnectivityManager` class can be used to answer queries about network connectivity status. It can also notifiy applications when network connectivity status changes using `ConnectivityManager.NetworkCallback`.



### Environment &amp; Tools
_Tools used in this post_

- Android Studio 3.5
- Google Pixel 3
- Kotlin 1.3.50


## ConnectivityManager

[`ConnectivityManager`](https://developer.android.com/reference/android/net/ConnectivityManager.html) class is the starting point to query about networ connectivity status. It can also notifiy applications when network connectivity changes.

An instance of `ConnectivityManager` class can give us access to an instance of `NetworkInfo` class which can be used to check current active network.

![cm-networkinfo-code.png]({{ "/images/android/cm-networkinfo-code.png" | absolute_url }})

## NetworkInfo is deprecated in API 29

[`NetworkInfo`](https://developer.android.com/reference/android/net/NetworkInfo.html) class holds details about the current active default network. Using `NetworkInfo.isConnected()` we can check the network connectivity status before initiating network traffic. However, `NetworkInfo` **was deprecated in API level 29.**

Developers should instead use [`ConnectivityManager.NetworkCallback`](https://developer.android.com/reference/android/net/ConnectivityManager.NetworkCallback.html) API to monitor connectivity changes.

## ConnectivityManager.NetworkCallback

Checking network connectivity and getting notifications about network changes can be achieved by registering `ConnectivityManager.NetworkCallback`. Interested applications should extend this static class and override the wanted methods such as `.onAvailable(Network)` & `.onLost(Network)`.



```java
val cm:ConnectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
val builder: NetworkRequest.Builder = NetworkRequest.Builder()

 cm.registerNetworkCallback(
            builder.build(),
            object : ConnectivityManager.NetworkCallback() {

                override fun onAvailable(network: Network) {                   
                        Log.i("MainActivity", "onAvailable!")

                        // check if NetworkCapabilities has TRANSPORT_WIFI
                        val isWifi:Boolean = cm.getNetworkCapabilities(network).hasTransport(
                            NetworkCapabilities.TRANSPORT_WIFI)

                        // doSomething()                
                }

                override fun onLost(network: Network) {
                    
                        Log.i("MainActivity", "onLost!")
                        
                        // doSomething                  
                }
            }
        )
```

### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-connectivity)

