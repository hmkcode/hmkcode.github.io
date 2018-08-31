---
layout: post
title:  "Android | How to Center Views & Content Horizontally and Vertically?"
date:   2018-08-31 01:00:00
categories: 
description: "How to center a view or its content e.g. TextView or Button horizontally and vertically? layout_gravity can be used to position a view in the center of its parent. While gravity attribute is used to position view’s content e.g. “text” in the center of the view."
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/android/center_text_hor_ver.png">
		<img 
			class="size-full wp-image-315 aligncenter" 
			src="http://hmkcode.github.io/images/android/center_text_hor_ver.png" 
			alt="java-servlet-json" />
	</a>
	
	How to center a view or its content e.g. TextView or Button horizontally and vertically? <code>layout_gravity</code> can be used to position a view in the center of its parent. While <code>gravity</code> attribute is used to position view’s content e.g. “text” in the center of the view.
	
</p>




## ( 1 ) Center Views Horizontally 


![center_views_horizontally]({{ "http://hmkcode.github.io/images/android/center_views_horizontally.png" | absolute_url }})

- Place target views in a `<LinearLayout>`
- Set `LinearLayout` attribute `android:orientation="vertical""`
- Set views attribute `android:layout_gravity="center"`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:layout_margin="10dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="5dp"
        android:text="TextView"
        android:layout_gravity="center"
        android:background="#333"
        android:textColor="#fff"
        />

    <Button
        androida:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="Button"/>

</LinearLayout>
```

## ( 2 ) Center Views Vertically 

![center_views_horizontally]({{ "http://hmkcode.github.io/images/android/center_views_vertically.png" | absolute_url }})

- Place target views in a `<LinearLayout>`
- Set `LinearLayout` attribute `android:orientation="horizontal""`
- Set views attribute `android:layout_gravity="center"`

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    android:layout_margin="10dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="5dp"
        android:text="TextView"
        android:layout_gravity="center"
        android:background="#333"
        android:textColor="#fff"
        />

    <Button
        androida:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="Button"/>

</LinearLayout>
```

## ( 3 ) Center Views Horizontally & Vertically 

![center_views_hor_ver]({{ "http://hmkcode.github.io/images/android/center_views_hor_ver.png" | absolute_url }})


- Place a `<LinearLayout>` with **vertical** orientation within a parent `<LinearLayout>` with **horizontal** orientation
- Set views & child `<LinearLayout>` attribute `android:layout_gravity="center"`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    android:layout_margin="10dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:layout_gravity="center">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:padding="5dp"
            android:text="TextView"
            android:layout_gravity="center"
            android:background="#333"
            android:textColor="#fff"
            />

        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="Button"/>

    </LinearLayout>

</LinearLayout>
```

## ( 4 ) Center Text Horizontally

![center_text_horizontally]({{ "http://hmkcode.github.io/images/android/center_text_horizontally.png" | absolute_url }})

- Set view attribute `android:gravity="center_horizontal"`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:layout_margin="10dp">
    
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="5dp"
        android:text="TextView"
        android:gravity="center_horizontal"
        android:background="#333"
        android:textColor="#fff" />
    
</LinearLayout>
```

## ( 5 ) Center Text Horizontally & Vertically

![center_text_hor_ver]({{ "http://hmkcode.github.io/images/android/center_text_hor_ver.png" | absolute_url }})

- Set view attribute `android:gravity="center_horizontal"`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:layout_margin="10dp">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="100dp"
        android:padding="5dp"
        android:text="TextView"
        android:gravity="center"
        android:background="#333"
        android:textColor="#fff" />

</LinearLayout>
```