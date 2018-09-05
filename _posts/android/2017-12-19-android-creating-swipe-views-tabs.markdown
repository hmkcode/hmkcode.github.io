---
layout: post
title:  "Android | Creating Swipe Views with Tabs"
date:   2018-09-05 12:00:00
categories: android
post_url: http://hmkcode.com/android-creating-swipe-views-tabs/
pre_url: http://hmkcode.com/material-design-app-android-design-support-library-appcompat/
pre_title: "Building Material Design App Using Android Design Support Library and AppCompat Theme"
description: You can navigate between sibling screens using horizontal finger gesture. This post shows you how to build swipe views and how to add tabs to action bar offering users a familiar interfaces
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/android/android-swipe-tabs.jpg">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/android/android-swipe-tabs.jpg" alt="get-location" />
	</a>
	
	You can navigate between sibling screens using horizontal finger gesture. 
	This post shows you how to build swipe views and how to add tabs to action bar offering users a familiar interfaces.
	
</p>

#### Objectives
1. Building an app with horizontal navigation between sibling screens "fragments".
2. Adding tabs to action bar for navigating between and identifying sibling screens in your app.

### Environment, Tools &amp; Library

- Android Studio 3.1.4
- Design Support Library `com.android.support:design:27.1.1`


## ( 1 ) Create new Android Project

Create new android application keep default options. 
This app is targeting API 19 or later

![target_api]({{ "http://hmkcode.github.io/images/android/target_android_devices_19_later.jpg" | absolute_url }})

## ( 2 ) Build Swipe Views

- To create swipe views use `ViewPager` widget.
- Extends `FragmentPagerAdapter` to hold child views .
- Create two fragments to be used as child views.


#### 2.1 Add a <ViewPager> element to your XML layout

**activity_main.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <android.support.v4.view.ViewPager
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:id="@+id/viewPager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</android.support.constraint.ConstraintLayout>
```


#### 2.2 Create two fragments 

Create two fragment `FirstFragment.java` & `SecondFragment.java`

**FirstFragment.java**

```java
package com.hmkcode.fragments;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import com.hmkcode.R;

public class FirstFragment extends Fragment {
    
    public FirstFragment() {}

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_first, container, false);
    }
}
```

**SecondFragment.java**

```java
package com.hmkcode.fragments;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import com.hmkcode.R;

public class SecondFragment extends Fragment {

    public SecondFragment() {}

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_second, container, false);
    }
}
```

**fragment_first.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:text="First Fragment"
        android:gravity="center"/>

</android.support.constraint.ConstraintLayout>
```

**fragment_second.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <TextView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:text="Second Fragment"
        android:gravity="center"/>

</android.support.constraint.ConstraintLayout>
```

#### 2.3 Extends `FragmentPagerAdapter` to hold child views 

* Adapter is a container for child views which needs to be hooked to ViewPager layout.
* There are two types of [PagerAdapter](https://developer.android.com/reference/android/support/v4/view/PagerAdapter.html) 
 1.[FragmentPagerAdapter](https://developer.android.com/reference/android/support/v4/app/FragmentPagerAdapter.html) for fixed small number of pages.
 2.[FragmentStatePagerAdapter](https://developer.android.com/reference/android/support/v4/app/FragmentStatePagerAdapter.html) for undetermined number of pages. It destroys fragments as the user navigates to other pages, minimizing memory usage.

**MyFragmentPagerAdapter.java**

```java
package com.hmkcode.adapters;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import com.hmkcode.fragments.FirstFragment;
import com.hmkcode.fragments.SecondFragment;

public class MyFragmentPagerAdapter extends FragmentPagerAdapter {


    public MyFragmentPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                return new FirstFragment();
            case 1:
                return new SecondFragment();
            default:
                return null;
        }
    }

    @Override
    public int getCount() {
        return 2;
    }
}
```

#### Put it all together!

**MainActivity.java**

```java
package com.hmkcode;

import android.support.v7.app.AppCompatActivity;
import android.support.v4.view.ViewPager;
import android.os.Bundle;
import com.hmkcode.adapters.MyFragmentPagerAdapter;

public class MainActivity extends AppCompatActivity {

    MyFragmentPagerAdapter myFragmentPagerAdapter;
    ViewPager viewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        viewPager = (ViewPager) findViewById(R.id.viewPager);

        setPagerAdapter();
    }

    private void setPagerAdapter(){
        myFragmentPagerAdapter = new MyFragmentPagerAdapter(getSupportFragmentManager());
        viewPager.setAdapter(myFragmentPagerAdapter);
    }

}

```

![android-tabs]({{"http://hmkcode.github.io/images/android/android-swipe.gif" | absolute_url }})

## ( 3 ) Adding Tabs 

While you can swipe between screens using horizontal finger gesture, android also offers tabs to switch between screens.

- To create swipe views use `TabLayout` widget.
- Attached pager adapter to tablayout using `setupWithViewPager()` method.


**gradel.build (app)**

> implementation 'com.android.support:design:27.1.1'

**activity_main.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <android.support.v4.view.ViewPager
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:id="@+id/viewPager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <android.support.design.widget.TabLayout
        android:id="@+id/tabLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:tabMode="fixed"
        app:tabGravity="fill"/>

</android.support.constraint.ConstraintLayout>
```

**MainActivity.java**

```java
package com.hmkcode;

import android.support.v7.app.AppCompatActivity;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.os.Bundle;
import com.hmkcode.adapters.MyFragmentPagerAdapter;

public class MainActivity extends AppCompatActivity {

    MyFragmentPagerAdapter myFragmentPagerAdapter;
    ViewPager viewPager;
    TabLayout tabLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        viewPager = (ViewPager) findViewById(R.id.viewPager);
        tabLayout = (TabLayout) findViewById(R.id.tabLayout);

        setPagerAdapter();
        setTabLayout();

    }

    private void setPagerAdapter(){
        myFragmentPagerAdapter = new MyFragmentPagerAdapter(getSupportFragmentManager());
        viewPager.setAdapter(myFragmentPagerAdapter);
    }

    private void setTabLayout() {
        tabLayout.setupWithViewPager(viewPager);

        tabLayout.getTabAt(0).setText("First");
        tabLayout.getTabAt(1).setText("Second");
    }
}

```

![android-tabs]({{ "http://hmkcode.github.io/images/android/android-swipe-tabs.gif" | absolute_url }})



### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/android-swipe-views-tabs)

