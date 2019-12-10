---
layout: post
title:  "Android | Handling Click Events Kotlin's Way"
date:   2019-12-10 12:00:00
categories: android
description: Listening to a button clicks is a common task in application development. A listener is set to listen and act upon click events. OnClickListener is an interface used to listen to click events of a button or any other components of type View.
---

![android-recyclerview-listadapter_files.png]({{ "/images/android/android-button-click.jpg" 
| absolute_url }})

Listening to a button clicks is a common task in application development. A listener is set to listen and act upon click events. `OnClickListener` is an interface used to listen to click events of a button or any other components of type `View`.

## View & Click Listener

- View is the basic building block for UI components. 
- Views can register or set listeners that will be notified when an event happens to the view.
- Components of type `View` can set click listener that get notified on click event.
- `setOnClickListener(OnClickListener l)` is used to set the click listener.
- Click listener is an instance of type `OnClickListener`.

**View.java**
```java
 public void setOnClickListener(OnClickListener l) { .... }
```

- `OnClickListener` is an interface with a single abstract method "SAM".

```java
public interface OnClickListener {
        void onClick(View v);
}
```

- **So, we need to pass an instance of type `OnClickListener` to `setOnClickListener()` function.**
- We can achieve this in the following ways.

## ( 1 ) The simplest old way, implement OnClickListener interface

- The simplest way to create an instance of type `OnClickListener` is by implementing it.
- Our activity can implement the interface `OnClickListener` and override `onClick()`.

```kotlin
// 1. extend View.OnClickListener
class MainActivity : AppCompatActivity(), View.OnClickListener {

    private lateinit var textView:TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.button)
        textView = findViewById<TextView>(R.id.textView)

        // 2. pass this as instance of OnClickListener
        button.setOnClickListener(this)

    }

    // 3. override onClick()
    override fun onClick(v: View?) {
        textView.setText("Clicked!")
    }
}
```

## ( 2 ) Use object expression 

- Use object expression to create an instance from an anonymous class implementing `OnClickListener`.

```kotlin
class MainActivity : AppCompatActivity() {

    private lateinit var textView:TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.button)
        textView = findViewById<TextView>(R.id.textView)

        // create an instance from anonymous class
        button.setOnClickListener{
            object: View.OnClickListener{
                override fun onClick(v: View?) {
                    textView.setText("Clicked!")
                }

            }
        }

    }
}
```

## ( 3 ) Lambda 

- Since `OnClickListener` is an interface with a single abstract function, we can use lambda.
- The `onClick()` function takes a parameter of type `View` and returns **void** or Unit for Kotlin.
- So, the function type of the lambda should be `(View) -> Unit`

```kotlin
class MainActivity : AppCompatActivity() {

    private lateinit var textView:TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.button)
        textView = findViewById<TextView>(R.id.textView)

        // create an instance from anonymous class
       button.setOnClickListener{ v -> textView.setText("Clicked!") }

    }
}
```

- Or, even simpler
```kotlin
button.setOnClickListener{ textView.setText("Clicked!") }
```
