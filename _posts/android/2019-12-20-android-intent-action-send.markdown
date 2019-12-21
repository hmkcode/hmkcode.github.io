---
layout: post
title:  "Android | Sending & Receiving Simple Data Between Apps"
date:   2019-12-20 12:00:00
categories: android
description: Intent is a messaging object that can be used to start app components such activity within an app or to interact with other apps. Explicit intent is used to launch a specific app component while implicit intent specifies an action that can invoke other apps able to perform the action. Here we will see how to use intent to send and receive simple data between apps. 
---


![android-recyclerview-listadapter_files.png]({{ "/images/android/android-send-receive-data-app.jpg" 
| absolute_url }})

Intent is a messaging object that can be used to start app components such activity within an app or to interact with other apps. Explicit intent is used to launch a specific app component while implicit intent specifies an action that can invoke other apps able to perform the action. Here we will see how to use intent to send and receive simple data between apps. 

## ( 1 ) Sending Text to Other Apps

- Using Intents and associated extras we can send data to other apps.
- Intent specifies the action to be performed.
- `ACTION_SEND` is used to send data from one activity to another.
- Data type should be specified in the intent.
- Android system identifies activities that can receive the data.

```kotlin
 fun send(){
    val sendIntent: Intent = Intent().apply {
        action = Intent.ACTION_SEND
        putExtra(Intent.EXTRA_TEXT, "Some text...")
        type = "text/plain"
    }

    val shareIntent = Intent.createChooser(sendIntent, null)
    startActivity(shareIntent)
}
```

![android-recyclerview-listadapter_files.png]({{ "/images/android/android-send-chooser.jpg" 
| absolute_url }})

## ( 2 ) Receiving Text from Other Apps

- Your app can also receive data from other apps. 
- Intent filters inform the system what intents an application component is willing to accept.
- Intent filter is defined in app manifest, using the `<intent-filter>` element.

```xml
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
</intent-filter>
```

- To read the content of the received intent in `onCreate()` 

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_receiving)

    val editText = findViewById<EditText>(R.id.editText)


    if(intent?.action == Intent.ACTION_SEND)
        editText.setText(intent.getStringExtra(Intent.EXTRA_TEXT))
}
```

### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/intent-action-send)
