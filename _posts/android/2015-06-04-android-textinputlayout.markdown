---
layout: post
title:  "Android | TextInputLayout"
date:   2015-05-29 09:43:00
categories: android
post_url: http://hmkcode.com/android-textinputlayout/
pre_url: http://hmkcode.com/android-location-settings-dialog/
pre_title: "Android | Location Settings Dialog"
post_img: http://hmkcode.github.io/images/2015/05/android-location-api.png
description: EditText , has a hint attribute that will show text inside the EditText telling the user what to enter in this text field. That hint text disappears due to the user inputting text. However, TextInputLayout , "a layout wrapping an EditText", shows hint as floating label when the hint is hidden due to the user inputting text. TextInputLayout is part of Design Support library. 
---
<p style="text-align: justify;">
	<a href="http://hmkcode.github.io/images/2015/05/android-location-api.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/2015/05/android-location-api.png" alt="get-location" />
	</a>
	<br/>
	<a href="https://developer.android.com/reference/android/widget/EditText.html">
		EditText
	</a>, has a hint attribute that will show text inside the EditText telling the user what to enter in this text field. That hint text disappears 
	due to the user inputting text. However, 
	<a href="https://developer.android.com/reference/android/support/design/widget/TextInputLayout.html">
		TextInputLayout	
	</a>, "a layout wrapping an EditText", shows hint as floating label when the hint is hidden due to the user inputting text. 
	 TextInputLayout is part of <i>Design Support library</i>.
	
</p>

### Environment &amp; Tools
- Windows 7
- Eclipse ADT
- Nexus 5
- Android Support Library, revision 22.2.0 or higher


## About this Sample App

The code below is for a dummy app that will show how TextInputLayout will work on your screen.


## ( 1 ) Create new Android Project

- **Application Name:** InputTextLayout
- **Project Name:** android-input-text-layout
- **Package Name:** com.hmkcode.inputtextlayout

## ( 2 ) Add TextInputLayotu to Layout XML

- `TextInputLayout` will wrap `EditText` view.
- `EditText` **hint** attribute should not be empty.

<pre style='color:#000000;background:#f1f0f0;'>
<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>RelativeLayout</span> <span style='color:#00dddd; '>xmlns</span><span style='color:#806030; '>:</span><span style='color:#074726; '>android</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/apk/res/android</span><span style='color:#800000; '>"</span>
    <span style='color:#00dddd; '>xmlns</span><span style='color:#806030; '>:</span><span style='color:#074726; '>tools</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>schemas.android.com</span><span style='color:#40015a; '>/tools</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>match_parent</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>match_parent</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>paddingBottom</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@dimen/activity_vertical_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>paddingLeft</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@dimen/activity_horizontal_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>paddingRight</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@dimen/activity_horizontal_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>paddingTop</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@dimen/activity_vertical_margin</span><span style='color:#800000; '>"</span>
    <span style='color:#007997; '>tools</span><span style='color:#806030; '>:</span><span style='color:#074726; '>context</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>com.hmkcode.inputtextlayout.MainActivity</span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>></span>

    
     <span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>android.support.design.widget.TextInputLayout</span>
        <span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>id</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@+id/til</span><span style='color:#800000; '>"</span>
      	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>fill_parent</span><span style='color:#800000; '>"</span>
      	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>wrap_content</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>></span>
       	<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>EditText</span>
        	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>id</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@+id/textDialog</span><span style='color:#800000; '>"</span>
        	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>fill_parent</span><span style='color:#800000; '>"</span>
        	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>wrap_content</span><span style='color:#800000; '>"</span>
        	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>hint</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>First Name</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>/></span>
  	<span style='color:#a65700; '>&lt;/</span><span style='color:#5f5035; '>android.support.design.widget.TextInputLayout</span><span style='color:#a65700; '>></span>
  
  	<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>android.support.design.widget.TextInputLayout</span>
    	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>id</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@+id/til2</span><span style='color:#800000; '>"</span>
      	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>fill_parent</span><span style='color:#800000; '>"</span>
      	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>wrap_content</span><span style='color:#800000; '>"</span>
      	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_below</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@+id/til</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>></span>
       	
       	<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>EditText</span>
      	  	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>id</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>@+id/textDialog2</span><span style='color:#800000; '>"</span>
        	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_width</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>fill_parent</span><span style='color:#800000; '>"</span>
        	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>layout_height</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>wrap_content</span><span style='color:#800000; '>"</span>
        	<span style='color:#007997; '>android</span><span style='color:#806030; '>:</span><span style='color:#074726; '>hint</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>Last Name</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>/></span>
  	<span style='color:#a65700; '>&lt;/</span><span style='color:#5f5035; '>android.support.design.widget.TextInputLayout</span><span style='color:#a65700; '>></span>

<span style='color:#a65700; '>&lt;/</span><span style='color:#5f5035; '>RelativeLayout</span><span style='color:#a65700; '>></span>
</pre>

<p class="note">
<b>Note:</b> This sample app was created in Eclipse ADT. You may need to go over the below steps to resolve 
some issues.
</p>

- Make sure you have **Android Support Library, revision 22.2.0** or higher.
- `TextInputLayout` is part of **Design Support Library**.
- You need to import `<android-sdk>/extras/android/support/design`.
- You need to import `<android-sdk>/extras/android/support/v7/appcompat`.
- After importing design library, you need to edit `project.proerties` file as following:

<pre style='color:#000000;background:#f1f0f0;'>
# Project target<span style='color:#806030; '>.</span>
target<span style='color:#806030; '>=</span>android<span style='color:#806030; '>-</span><span style='color:#8c0000; '>21</span>
android<span style='color:#8c0000; '>.</span>library<span style='color:#8c0000; '>.</span>reference<span style='color:#8c0000; '>.1</span><span style='color:#806030; '>=</span><span style='color:#806030; '>.</span><span style='color:#806030; '>.</span><span style='color:#806030; '>/</span>v7<span style='color:#806030; '>/</span>appcompat
android<span style='color:#8c0000; '>.</span>library<span style='color:#806030; '>=</span>true
</pre>

- In your app project, [reference design library project] (https://developer.android.com/tools/projects/projects-eclipse.html#ReferencingLibraryProject).




### Source Code @ [GitHub] (https://github.com/hmkcode/Android/tree/master/android-input-text-layout)

