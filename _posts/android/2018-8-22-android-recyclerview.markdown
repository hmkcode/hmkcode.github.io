---
layout: post
title:  "Android | Create a List with RecyclerView"
date:   2018-08-22 12:30:00
categories: android
post_url: http://hmkcode.com/android-creating-swipe-views-tabs/
pre_url: http://hmkcode.com/material-design-app-android-design-support-library-appcompat/
pre_title: "Building Material Design App Using Android Design Support Library and AppCompat Theme"
description: Creating a scrollable list of elements is a common pattern in mobile application. Using RecyclerView we can list a large data sets or frequently changing one. RecyclerView is an advanced and flexible version of ListView, addressing serveral issues with existing listing views. 
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/android/android-recyclerview-app_layout.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/android/android-recyclerview-app_layout.png" alt="android-recyclerview-app_layout" />
	</a>
	
	Creating a scrollable list of elements is a common pattern in mobile application. Using RecyclerView we can list a large data sets or frequently changing one. <b>RecyclerView</b> is an advanced and flexible version of ListView, addressing serveral issues with existing listing views. Here we will build a simple application with <b>RecyclerView</b>
	
</p>


#### Environment, Tools &amp; Library

- Android Studio 3.1.1
- Android Support Library `com.android.support:recyclerview-v7:27.1.1`

## Overview

We will build a simple app that lists a hard-coded `Link` in a `RecyclerView`. To display items on `RecyclerView` you need to have the following components:

- `RecyclerView` widget added to the activity layout.  
- A class extending `RecyclerView.Adapter`. 
- A class extending `RecyclerView.ViewHolder`. 
- Layout for RecyclerView items.  

Files we need for this app are shown in the image below. 

![android-recyclerview-app-files]({{ "http://hmkcode.github.io/images/android/android-recyclerview-app-files.png" | absolute_url }})

## ( 1 ) Create new Android Project

Create new android application keep default options. 
This app is targeting API 19 or later

![target_api]({{ "http://hmkcode.github.io/images/android/target_android_devices_19_later.jpg" | absolute_url }})


## ( 2 ) Add the Support Library

Add the v7 Support Libraries to `build.gradle`

```groovy
dependencies {
    implementation 'com.android.support:recyclerview-v7:27.1.1'
}
```

## ( 3 ) Add RecyclerView to Layout

- Add `RecyclerView` to layout `activity_main.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/forcast_list"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```

## ( 4 ) MainActivity 


- Obtain a handle to the `RecycleView` object
- Set layout manager using **setLayoutManager()**

> *You can use a standard layout managers (such as LinearLayoutManager or GridLayoutManager), or implement your own.* 

- Attach an adapter for the data to be displayed **setAdapter()**.

`MainActivity.java`

```java
package com.hmkcode.activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import com.hmkcode.R;
import com.hmkcode.adapters.MyAdapter;
import com.hmkcode.model.Link;

import java.util.LinkedList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        recyclerView = findViewById(R.id.recyclerView);

        // layout manager
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);

        // adapter
        RecyclerView.Adapter adapter = new MyAdapter(getListData());
        recyclerView.setAdapter(adapter);

    }

    //generate a list of Link
    private static List<Link> getListData(){...}
}

```

## ( 5 )  Extending RecyclerView ViewHolder & Adapter

- **View holder** objects represent views in the `RecyclerView` 
- Each **view holder** object is an instance of a class extending `RecyclerView.ViewHolder`
- Each **view holder** displays a single item with a view.
- **View hodler** objects are managed by **adapter** 
- **Adapter** is created by extending `RecyclerView.Adapter`
- **Adapter** creates **view hoders** as needed by calling **onCreateViewHolder()** which returns instance of a class created by extending `RecyclerView.ViewHolder`.
- **Adapter** also binds the view holders to their data using **onBindViewHolder()**.

```java
package com.hmkcode.adapters;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.hmkcode.R;
import com.hmkcode.model.Link;

import java.util.List;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {

    private List<Link> links;

    // constructor
    public MyAdapter(List<Link> links){
        this.links = links;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        // inflate item_layout
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_layout, null);

        MyViewHolder vh = new MyViewHolder(itemLayoutView);
        return vh;
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        holder.itemIcon.setImageResource(links.get(position).getIcon());
        holder.itemTitle.setText(links.get(position).getTitle());
        holder.itemUrl.setText(links.get(position).getUrl());
    }

    @Override
    public int getItemCount() {
        if(links != null)
            return links.size();
        else
            return 0;
    }

    // inner static class
    public static class MyViewHolder extends RecyclerView.ViewHolder {

        public TextView itemTitle;
        public TextView itemUrl;
        public ImageView itemIcon;

        public MyViewHolder(View itemLayoutView) {
            super(itemLayoutView);
            itemTitle = itemLayoutView.findViewById(R.id.item_title);
            itemUrl = itemLayoutView.findViewById(R.id.item_url);
            itemIcon = itemLayoutView.findViewById(R.id.item_icon);
        }
    }
}
```

## ( 6 ) RecyclerView Element Layout

- Below is the layout for `RecyclerView` items.
- The layout displays `ImageView` on the left and two `TextView` below each other to the right of the `ImageView`

```xml
<?xml version="1.0" encoding="utf-8"?>

<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:padding="5dp">

    <RelativeLayout
        ...
        android:background="@drawable/item_border">

        <!-- icon -->
        <ImageView
            android:id="@+id/item_icon"
            .../>

        <!-- title -->
        <TextView
            android:id="@+id/item_title"
            .../>

        <TextView
            android:id="@+id/item_url"
            ... />

    </RelativeLayout>

</LinearLayout>
```




### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-recyclerview)

