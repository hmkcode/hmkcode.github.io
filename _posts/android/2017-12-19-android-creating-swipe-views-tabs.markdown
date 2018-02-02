---
layout: post
title:  "Android | Creating Swipe Views with Tabs"
date:   2017-12-19 20:30:00
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
	This post shows you how to build swipe views and how to add tabs to action bar which will offer your users a familiar interface for horizontal navigation.
	
</p>

#### Objectives
1. Building an app with horizontal navigation between sibling screens "fragments".
2. Adding tabs to action bar for navigating between an identified sibling screens in your app.

### Environment, Tools &amp; Library
_used in this post_

- Windows 8
- Android Studio 3.0.1
- Nexus 5
- Design Support Library _com.android.support:design:26.1.0_


## ( 1 ) Create new Android Project

Create new android application keep default options. 
This app is targeting API 19 or later

![target_api]({{ "http://hmkcode.github.io/images/android/target_android_devices_19_later.jpg" | absolute_url }})

## ( 2 ) Build Swipe Views

- To create swipe views, use `ViewPager` widget.
- Extends `FragmentPagerAdapter` to hold child views .
- Create two fragments to be used as child views.


#### 2.1 Add a <ViewPager> element to your XML layout

**activity_main.xml**

<pre><span style='color:#004a43; '>&lt;?</span><span style='color:#800000; font-weight:bold; '>xml</span><span style='color:#004a43; '> </span><span style='color:#074726; '>version</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#7d0045; '>1.0</span><span style='color:#800000; '>"</span><span style='color:#004a43; '> </span><span style='color:#074726; '>encoding</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>utf-8</span><span style='color:#800000; '>"</span><span style='color:#004a43; '>?></span>
<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>RelativeLayout</span> <span style='color:#666616; '>xmlns</span><span style='color:#800080; '>:</span><span style='color:#074726; '>android</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#666616; '>http</span><span style='color:#800080; '>:</span><span style='color:#800000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/apk/res/android</span><span style='color:#800000; '>"</span>
    <span style='color:#666616; '>xmlns</span><span style='color:#800080; '>:</span><span style='color:#074726; '>app</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#666616; '>http</span><span style='color:#800080; '>:</span><span style='color:#800000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/apk/res-auto</span><span style='color:#800000; '>"</span>
    <span style='color:#666616; '>xmlns</span><span style='color:#800080; '>:</span><span style='color:#074726; '>tools</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#666616; '>http</span><span style='color:#800080; '>:</span><span style='color:#800000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/tools</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_width</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_height</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>orientation</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>vertical</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>tools</span><span style='color:#800080; '>:</span><span style='color:#274796; '>context</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>com.hmkcode.android.MainActivity</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>></span>

     <span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>android.support.v4.view.ViewPager</span>
        <span style='color:#666616; '>xmlns</span><span style='color:#800080; '>:</span><span style='color:#074726; '>android</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#666616; '>http</span><span style='color:#800080; '>:</span><span style='color:#800000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/apk/res/android</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>id</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>@+id/pager</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_width</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#800000; '>"</span>
        <span style='color:#007997; '>android</span><span style='color:#800080; '>:</span><span style='color:#274796; '>layout_height</span><span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>/></span>

<span style='color:#a65700; '>&lt;/</span><span style='color:#5f5035; '>RelativeLayout</span><span style='color:#a65700; '>></span>
</pre>


#### 2.2 Create two fragments 

Create two fragment `FirstFragment.java` & `SecondFragment.java`

**FirstFragment.java**

<pre><span style='color:#0000ff; font-weight:bold; '>public</span> <span style='color:#0000ff; font-weight:bold; '>class</span> FirstFragment <span style='color:#0000ff; font-weight:bold; '>extends</span> Fragment <span style='color:#0000ff; '>{</span>

    <span style='color:#0000ff; font-weight:bold; '>public</span> FirstFragment<span style='color:#0000ff; '>(</span><span style='color:#0000ff; '>)</span> <span style='color:#0000ff; '>{</span><span style='color:#0000ff; '>}</span>

    <span style='color:#0000ff; '>@</span>Override
    <span style='color:#0000ff; font-weight:bold; '>public</span> <span style='color:#0000ff; font-weight:bold; '>void</span> onCreate<span style='color:#0000ff; '>(</span>Bundle savedInstanceState<span style='color:#0000ff; '>)</span> <span style='color:#0000ff; '>{</span>
        <span style='color:#0000ff; font-weight:bold; '>super</span><span style='color:#0000ff; '>.</span>onCreate<span style='color:#0000ff; '>(</span>savedInstanceState<span style='color:#0000ff; '>)</span><span style='color:#0000ff; '>;</span>

    <span style='color:#0000ff; '>}</span>

    <span style='color:#0000ff; '>@</span>Override
    <span style='color:#0000ff; font-weight:bold; '>public</span> View onCreateView<span style='color:#0000ff; '>(</span>LayoutInflater inflater<span style='color:#0000ff; '>,</span> ViewGroup container<span style='color:#0000ff; '>,</span>
                             Bundle savedInstanceState<span style='color:#0000ff; '>)</span> <span style='color:#0000ff; '>{</span>
        <span style='color:#0000ff; font-weight:bold; '>return</span> inflater<span style='color:#0000ff; '>.</span>inflate<span style='color:#0000ff; '>(</span>R<span style='color:#0000ff; '>.</span>layout<span style='color:#0000ff; '>.</span>fragment_first<span style='color:#0000ff; '>,</span> container<span style='color:#0000ff; '>,</span> <span style='color:#0000ff; font-weight:bold; '>false</span><span style='color:#0000ff; '>)</span><span style='color:#0000ff; '>;</span>
    <span style='color:#0000ff; '>}</span>
<span style='color:#0000ff; '>}</span>
</pre>

**SecondFragment.java**

<pre><span style='color:#0000ff; font-weight:bold; '>public</span> <span style='color:#0000ff; font-weight:bold; '>class</span> SecondFragment <span style='color:#0000ff; font-weight:bold; '>extends</span> Fragment <span style='color:#0000ff; '>{</span>
    
    <span style='color:#0000ff; font-weight:bold; '>public</span> SecondFragment<span style='color:#0000ff; '>(</span><span style='color:#0000ff; '>)</span> <span style='color:#0000ff; '>{</span><span style='color:#0000ff; '>}</span>

    <span style='color:#0000ff; '>@</span>Override
    <span style='color:#0000ff; font-weight:bold; '>public</span> <span style='color:#0000ff; font-weight:bold; '>void</span> onCreate<span style='color:#0000ff; '>(</span>Bundle savedInstanceState<span style='color:#0000ff; '>)</span> <span style='color:#0000ff; '>{</span>
        <span style='color:#0000ff; font-weight:bold; '>super</span><span style='color:#0000ff; '>.</span>onCreate<span style='color:#0000ff; '>(</span>savedInstanceState<span style='color:#0000ff; '>)</span><span style='color:#0000ff; '>;</span>

    <span style='color:#0000ff; '>}</span>

    <span style='color:#0000ff; '>@</span>Override
    <span style='color:#0000ff; font-weight:bold; '>public</span> View onCreateView<span style='color:#0000ff; '>(</span>LayoutInflater inflater<span style='color:#0000ff; '>,</span> ViewGroup container<span style='color:#0000ff; '>,</span>
                             Bundle savedInstanceState<span style='color:#0000ff; '>)</span> <span style='color:#0000ff; '>{</span>
        <span style='color:#0000ff; font-weight:bold; '>return</span> inflater<span style='color:#0000ff; '>.</span>inflate<span style='color:#0000ff; '>(</span>R<span style='color:#0000ff; '>.</span>layout<span style='color:#0000ff; '>.</span>fragment_second<span style='color:#0000ff; '>,</span> container<span style='color:#0000ff; '>,</span> <span style='color:#0000ff; font-weight:bold; '>false</span><span style='color:#0000ff; '>)</span><span style='color:#0000ff; '>;</span>
    <span style='color:#0000ff; '>}</span>
<span style='color:#0000ff; '>}</span>
</pre>

**fragment_first.xml**
<pre><span style='color:#000080; '>&lt;</span><span style='color:#000080; '>LinearLayout</span> xmlns<span style='color:#0000ff; '>:</span><span style='color:#074726; '>android</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#0000ff; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/apk/res/android</span><span style='color:#0000e6; '>"</span>
    xmlns<span style='color:#0000ff; '>:</span><span style='color:#074726; '>tools</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#0000ff; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/tools</span><span style='color:#0000e6; '>"</span>
    android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
    android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
    tools<span style='color:#0000ff; '>:</span><span style='color:#074726; '>context</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>com.hmkcode.android.fragments.FirstFragment</span><span style='color:#0000e6; '>"</span><span style='color:#000080; '>></span>

    <span style='color:#000080; '>&lt;</span><span style='color:#000080; '>TextView</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>text</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>First Fragment</span><span style='color:#0000e6; '>"</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>gravity</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>center</span><span style='color:#0000e6; '>"</span><span style='color:#000080; '>/></span>

<span style='color:#000080; '>&lt;/</span><span style='color:#000080; '>LinearLayout</span><span style='color:#000080; '>></span>
</pre>

**fragment_second.xml**
<pre><span style='color:#000080; '>&lt;</span><span style='color:#000080; '>LinearLayout</span> xmlns<span style='color:#0000ff; '>:</span><span style='color:#074726; '>android</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#0000ff; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/apk/res/android</span><span style='color:#0000e6; '>"</span>
    xmlns<span style='color:#0000ff; '>:</span><span style='color:#074726; '>tools</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#0000ff; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/tools</span><span style='color:#0000e6; '>"</span>
    android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
    android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
    tools<span style='color:#0000ff; '>:</span><span style='color:#074726; '>context</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>com.hmkcode.android.fragments.SecondFragment</span><span style='color:#0000e6; '>"</span><span style='color:#000080; '>></span>

    <span style='color:#000080; '>&lt;</span><span style='color:#000080; '>TextView</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>match_parent</span><span style='color:#0000e6; '>"</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>text</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>Second Fragment</span><span style='color:#0000e6; '>"</span>
        android<span style='color:#0000ff; '>:</span><span style='color:#074726; '>gravity</span><span style='color:#0000ff; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#0000e6; '>center</span><span style='color:#0000e6; '>"</span><span style='color:#000080; '>/></span>

<span style='color:#000080; '>&lt;/</span><span style='color:#000080; '>LinearLayout</span><span style='color:#000080; '>></span>
</pre>

#### 2.3 Extends `FragmentPagerAdapter` to hold child views 

* Adapter is a container for child views which needs to be hooked to ViewPager layout.
* There are two types of [PagerAdapter](https://developer.android.com/reference/android/support/v4/view/PagerAdapter.html) 
 1.[FragmentPagerAdapter](https://developer.android.com/reference/android/support/v4/app/FragmentPagerAdapter.html) for fixed small number of pages.
 2.[FragmentStatePagerAdapter](https://developer.android.com/reference/android/support/v4/app/FragmentStatePagerAdapter.html) for undetermined number of pages. It destroys fragments as the user navigates to other pages, minimizing memory usage.

**MyFragmentPagerAdapter.java**
<pre><span style='color:#000084; font-weight:bold; '>public</span> <span style='color:#000084; font-weight:bold; '>class</span> MyFragmentPagerAdapter <span style='color:#000084; font-weight:bold; '>extends</span> FragmentPagerAdapter {


    <span style='color:#000084; font-weight:bold; '>public</span> MyFragmentPagerAdapter(FragmentManager fm) {
        <span style='color:#000084; font-weight:bold; '>super</span>(fm);
    }

    @Override
    <span style='color:#000084; font-weight:bold; '>public</span> Fragment getItem(<span style='color:#000084; font-weight:bold; '>int</span> position) {
        <span style='color:#000084; font-weight:bold; '>switch</span> (position) {
            <span style='color:#000084; font-weight:bold; '>case</span> 0:
                <span style='color:#000084; font-weight:bold; '>return</span> <span style='color:#000084; font-weight:bold; '>new</span> FirstFragment();
            <span style='color:#000084; font-weight:bold; '>case</span> 1:
                <span style='color:#000084; font-weight:bold; '>return</span> <span style='color:#000084; font-weight:bold; '>new</span> SecondFragment();
            <span style='color:#000084; font-weight:bold; '>default</span>:
                <span style='color:#000084; font-weight:bold; '>return</span> <span style='color:#000084; font-weight:bold; '>null</span>;
        }
    }

    @Override
    <span style='color:#000084; font-weight:bold; '>public</span> <span style='color:#000084; font-weight:bold; '>int</span> getCount() {
        <span style='color:#000084; font-weight:bold; '>return</span> 2;
    }
}
</pre>

#### Put it all together!

**MainActivity.java**
<pre><span style='color:#000084; font-weight:bold; '>public</span> <span style='color:#000084; font-weight:bold; '>class</span> MainActivity <span style='color:#000084; font-weight:bold; '>extends</span> AppCompatActivity {

    MyFragmentPagerAdapter myFragmentPagerAdapter;
    ViewPager mViewPager;


    @Override
    <span style='color:#000084; font-weight:bold; '>protected</span> <span style='color:#000084; font-weight:bold; '>void</span> onCreate(Bundle savedInstanceState) {
        <span style='color:#000084; font-weight:bold; '>super</span>.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        myFragmentPagerAdapter = <span style='color:#000084; font-weight:bold; '>new</span> MyFragmentPagerAdapter(getSupportFragmentManager());
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(myFragmentPagerAdapter);

    }
}
</pre>

![android-tabs]({{"http://hmkcode.github.io/images/android/android-swipe.gif" | absolute_url }})

## ( 3 ) Adding Tabs 

While you can swipe between screens using horizontal finger gesture, android also offers tabs to switch between screens.

- To create swipe views use `TabLayout` widget.
- Attached pager adapter to tablayout using `setupWithViewPager()` method.


**gradel.build (app)**

<pre>
compile 'com.android.support:design:26.1.0'
</pre>

**activity_main.xml**

<pre><span style='color:#000084; '>&lt;?</span><span style='color:#000084; font-weight:bold; '>xml</span><span style='color:#000084; '> </span><span style='color:#000084; '>version</span><span style='color:#000084; '>=</span><span style='color:#0000ff; '>"</span><span style='color:#000084; font-weight:bold; '>1.0</span><span style='color:#0000ff; '>"</span><span style='color:#000084; '> </span><span style='color:#000084; '>encoding</span><span style='color:#000084; '>=</span><span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>utf-8</span><span style='color:#0000ff; '>"</span><span style='color:#000084; '>?></span>
<span style='color:#7f0055; '>&lt;</span><span style='color:#7f0055; '>RelativeLayout</span> xmlns:android=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#000084; font-weight:bold; '>//</span><span style='color:#3f3fbf; '>schemas.android.com</span><span style='color:#3f3fbf; '>/apk/res/android</span><span style='color:#0000ff; '>"</span>
    xmlns:app=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#000084; font-weight:bold; '>//</span><span style='color:#3f3fbf; '>schemas.android.com</span><span style='color:#3f3fbf; '>/apk/res-auto</span><span style='color:#0000ff; '>"</span>
    xmlns:tools=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#000084; font-weight:bold; '>//</span><span style='color:#3f3fbf; '>schemas.android.com</span><span style='color:#3f3fbf; '>/tools</span><span style='color:#0000ff; '>"</span>
    android:layout_width=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>match_parent</span><span style='color:#0000ff; '>"</span>
    android:layout_height=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>match_parent</span><span style='color:#0000ff; '>"</span>
    android:orientation=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>vertical</span><span style='color:#0000ff; '>"</span>
    tools:context=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>com.hmkcode.android.MainActivity</span><span style='color:#0000ff; '>"</span><span style='color:#7f0055; '>></span>

     <span style='color:#7f0055; '>&lt;</span><span style='color:#7f0055; '>android.support.v4.view.ViewPager</span>
        xmlns:android=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>http</span><span style='color:#0000ff; '>:</span><span style='color:#000084; font-weight:bold; '>//</span><span style='color:#3f3fbf; '>schemas.android.com</span><span style='color:#3f3fbf; '>/apk/res/android</span><span style='color:#0000ff; '>"</span>
        android:id=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>@+id/pager</span><span style='color:#0000ff; '>"</span>
        android:layout_width=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>match_parent</span><span style='color:#0000ff; '>"</span>
        android:layout_height=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>match_parent</span><span style='color:#0000ff; '>"</span> <span style='color:#7f0055; '>/></span>

     <span style='color:#7f0055; '>&lt;</span><span style='color:#7f0055; '>android.support.design.widget.TabLayout</span>
         android:id=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>@+id/tabLayout</span><span style='color:#0000ff; '>"</span>
         android:layout_width=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>match_parent</span><span style='color:#0000ff; '>"</span>
         android:layout_height=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>wrap_content</span><span style='color:#0000ff; '>"</span>
         app:tabMode=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>fixed</span><span style='color:#0000ff; '>"</span>
         app:tabGravity=<span style='color:#0000ff; '>"</span><span style='color:#0000ff; '>fill</span><span style='color:#0000ff; '>"</span> <span style='color:#7f0055; '>/></span>

<span style='color:#7f0055; '>&lt;/</span><span style='color:#7f0055; '>RelativeLayout</span><span style='color:#7f0055; '>></span>
</pre>

**MainActivity.java**
<pre><span style='color:#000084; font-weight:bold; '>public</span> <span style='color:#000084; font-weight:bold; '>class</span> MainActivity <span style='color:#000084; font-weight:bold; '>extends</span> AppCompatActivity {

    MyFragmentPagerAdapter myFragmentPagerAdapter;
    ViewPager mViewPager;
    TabLayout tabLayout;
    
    @Override
    <span style='color:#000084; font-weight:bold; '>protected</span> <span style='color:#000084; font-weight:bold; '>void</span> onCreate(Bundle savedInstanceState) {
        <span style='color:#000084; font-weight:bold; '>super</span>.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mViewPager = (ViewPager) findViewById(R.id.pager);
        tabLayout = (TabLayout) findViewById(R.id.tabLayout);

        setPagerAdapter();
        setTabLayout();
    }

    <span style='color:#000084; font-weight:bold; '>private</span> <span style='color:#000084; font-weight:bold; '>void</span> setPagerAdapter(){

        myFragmentPagerAdapter = <span style='color:#000084; font-weight:bold; '>new</span> MyFragmentPagerAdapter(getSupportFragmentManager());
        mViewPager.setAdapter(myFragmentPagerAdapter);

    }

    <span style='color:#000084; font-weight:bold; '>private</span> <span style='color:#000084; font-weight:bold; '>void</span> setTabLayout() {

        tabLayout.setupWithViewPager(mViewPager);

        tabLayout.getTabAt(0).setText(<span style='color:#0000ff; '>"First"</span>);
        tabLayout.getTabAt(1).setText(<span style='color:#0000ff; '>"Second"</span>);
    }
}
</pre>

![android-tabs]({{ "http://hmkcode.github.io/images/android/android-swipe-tabs.gif" | absolute_url }})



### Source Code @ [GitHub](https://github.com/hmkcode/Android/tree/master/user-interface/android-swipe-views-tabs)

