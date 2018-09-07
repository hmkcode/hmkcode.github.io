---
layout: post
title:  "Android | RecyclerView Using Support Library ListAdapter"
date:   2018-09-06 12:30:00
categories: android
description: ListAdapter for RecyclerView has been introduced in Revision 27.1.0 Release of Support Library. ListAdapter uses DiffUtil under the hood to compute list diffs on a background thread. This will help RecyclerView animate changes automatically with less work on the UI thread. 
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/android/android-recyclerview-listadapter.gif">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/android/android-recyclerview-listadapter.gif" alt="android-recyclerview-listadapter" />
	</a>
	
	<code>ListAdapter</code> for <code>RecyclerView</code> has been introduced in <a href="https://developer.android.com/topic/libraries/support-library/revisions.html#27-1-0">Revision 27.1.0 Release of Support Library</a>. <code>ListAdapter</code> uses <code>DiffUtil</code> under the hood to compute list diffs on a background thread. This will help <code>RecyclerView</code> animate changes automatically with less work on the UI thread. 
	
</p>



#### Environment, Tools &amp; Library

- Android Studio 3.1.4
- Android Support Library `com.android.support:recyclerview-v7:27.1.1`
- Java 1.8+ for Lambda experssions support

## Overview

We will build an app that displays a list of hard-coded instances of class `Link` in a `RecyclerView`. We will use `ListAdapter`instead of the usual `RecyclerView.Adapter` as shown in a previous post [Create a List with RecyclerView](http://hmkcode.github.io/android/android-recyclerview/). To display items on `RecyclerView` you need to the following:

- `RecyclerView` widget added to the activity layout.  
- A class extending `DiffUtil.ItemCallback`
- A class extending `ListAdapter`. 
- A class extending `RecyclerView.ViewHolder`. 
- Layout for RecyclerView items.  

Files we need for this app are shown in the image below. 

![android-recyclerview-listadapter_files.png]({{ "http://hmkcode.github.io/images/android/android-recyclerview-listadapter_files.png" | absolute_url }})

## ( 1 ) Create new Android Project

Create new android application keep default options. 
This app is targeting API 19 or later

![target_api]({{ "http://hmkcode.github.io/images/android/target_android_devices_19_later.jpg" | absolute_url }})


## ( 2 ) Add the Support Library

- Add the v7 Support Library to gradle build file

**`build.gradle`**

```groovy
dependencies {
    implementation 'com.android.support:recyclerview-v7:27.1.1'
}
```

## ( 3 ) Add RecyclerView to Layout

- Add `RecyclerView` to the activity layout.

**`activity_main.xml`**

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

## ( 4 ) Extend DiffUtil.ItemCallback 

> [`DiffUtil`](https://developer.android.com/reference/android/support/v7/util/DiffUtil) is a utility class that can calculate the difference between two lists and output a list of update operations that converts the first list into the second one. 
> `DiffUtil.Callback` is a Callback class used by `DiffUtil` while calculating the diff between two lists. 
> `DiffUtil.Callback` serves two roles - list indexing, and item diffing. `ItemCallback` handles just the second of these, which allows separation of code that indexes into an array or List from the presentation-layer and content specific diffing code.


- We need an instance of `DiffUtil.ItemCallback` to be passed into `ListAdapter` constructor.  

> ListAdapter(ItemCallback<T> diffCallback) 

**`LinkDiffCallback.java`**

```java
package com.hmkcode.utils;

import android.support.v7.util.DiffUtil;
import com.hmkcode.models.Link;

public class LinkDiffCallback extends DiffUtil.ItemCallback<Link> {
    @Override
    public boolean areItemsTheSame(Link oldItem, Link newItem) {
        return oldItem.getUrl().equals(newItem.getUrl());
    }

    @Override
    public boolean areContentsTheSame(Link oldItem, Link newItem) {
        return oldItem.getUrl().equals(newItem.getUrl());
    }
}

```

## ( 5 ) Functional Interface 

This interface is not needed for the implementation of the `RecyclerView`. It just serves as a bridge in passing click event from `ListAdapter` to `MainActivity` to update the list of links `List<Link> links;`. 

It is annotated with `@FunctionalInterface` to take advantage of lambda expression. 

```java
package com.hmkcode.listeners;

import com.hmkcode.models.Link;

@FunctionalInterface
public interface MyItemClickListener {
    public void onClick(Link link);
}
```

## ( 6 ) Extending ListAdapter & RecyclerView.ViewHolder

- `MyListAdapter` calss extends `ListAdapter<Link, MyListAdapter.MyViewHolder>`
- Define constructor `MyListAdapter(ItemCallback, MyItemClickListener)`
- Override **onCreateViewHolder()** to inflate layout **item_layout** & return object of type `MyViewHolder`.
- Override **onBindViewHolder()** to bind returned `MyViewHolder` with item i.e. `Link` returned by **getItem(position)** .
- Define inner class `MyViewHolder` that extends `RecyclerView.ViewHolder`

```java
package com.hmkcode.adapters;

import android.support.annotation.NonNull;
import android.support.v7.recyclerview.extensions.ListAdapter;
import android.support.v7.util.DiffUtil;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import com.hmkcode.R;
import com.hmkcode.listeners.MyItemClickListener;
import com.hmkcode.models.Link;

public class MyListAdapter extends ListAdapter<Link, MyListAdapter.MyViewHolder> {

    MyItemClickListener myItemClickListener;
    public MyListAdapter(@NonNull DiffUtil.ItemCallback diffCallback,
                         MyItemClickListener myItemClickListener) {
        super(diffCallback);
        this.myItemClickListener = myItemClickListener;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_layout, null);

        return new MyViewHolder(itemLayoutView);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder myViewHolder, int position) {
        myViewHolder.bind(getItem(position));
    }
    
    // inner class
    public class MyViewHolder extends RecyclerView.ViewHolder {

        private View itemLayoutView;
        private TextView itemTitle;
        private TextView itemUrl;
        private ImageView itemIcon;

        public MyViewHolder(View itemLayoutView) {
            super(itemLayoutView);
            this.itemLayoutView = itemLayoutView;
            this.itemTitle = itemLayoutView.findViewById(R.id.item_title);
            this.itemUrl = itemLayoutView.findViewById(R.id.item_url);
            this.itemIcon = itemLayoutView.findViewById(R.id.item_icon);
        }
        public void bind(Link link){
            this.itemIcon.setImageResource(link.getIcon());
            this.itemTitle.setText(link.getTitle());
            this.itemUrl.setText(link.getUrl());

            this.itemLayoutView.setOnClickListener(
                    v -> myItemClickListener.onClick(link));

        }

    }
}

```

## ( 7 ) MainActivity 


- Obtain a handle to the `RecycleView` object
- Set layout manager using **setLayoutManager()**

> *You can use a standard layout managers (such as LinearLayoutManager or GridLayoutManager), or implement your own.* 

- Create an adapter of type `MyListAdapter` 

```java
listAdapter = new MyListAdapter(new LinkDiffCallback(), link -> updateList(link));
```

> First argument  is instance of `LinkDiffCallback`
> Second argument is lambda expression which is a *cooler* way of passing argument of type `MyItemClickListener`. You can use anonymous class to accomplish the same result. 


- Attach an adapter for the data to be displayed **setAdapter(listAdapter)**.
- Call `listAdapter.submitList(getListData());`

**`MainActivity.java`**

```java
package com.hmkcode.activities;

import ...

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private List<Link> links;
    private ListAdapter listAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        recyclerView = findViewById(R.id.recyclerView);

        // layout manager
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);

        recyclerView.setClickable(true);

        // list adapter
        links = getListData();

        listAdapter = new MyListAdapter(new LinkDiffCallback(),
                link -> updateList(link));

        recyclerView.setAdapter(listAdapter);

        listAdapter.submitList(getListData());

    }

    private void updateList(Link link){
        boolean removed = links.remove(link);
        listAdapter.submitList(new LinkedList(links));
    }

    //generate a list of Link
    private List<Link> getListData(){...}
}

```

### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-recyclerview/app-listadapter)

