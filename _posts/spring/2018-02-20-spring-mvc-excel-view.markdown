---
layout: post
title:  "Spring MVC Excel View Resolver"
date:   2018-02-20 14:30:00
categories: spring
description: Spring MVC can render retrieved data into views of different format such as PDF, JSP or Excel. Spring framework view resolvers e.g. InternalResourceViewResolver, XmlViewResolver, ResourceBundleViewResolver and a few others enable you to render model into views. This post shows you how to render model into Excel view using XmlViewResolver.
---


<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/spring/spring-mvc-excel-view.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/spring/spring-mvc-excel-view.png" alt="spring-mvc-view" />
	</a>
	
	The <b>V</b> in MVC is about viewing the data, or "model", requested through the controller. Spring MVC can render retrieved data into views of different format such as PDF, JSP or Excel. Spring framework view resolvers e.g. InternalResourceViewResolver, XmlViewResolver, ResourceBundleViewResolver and a few others enable you to render model into views. This post shows you how to render model into Excel view using XmlViewResolver.
</p>

## Overview

We will build a REST service using Spring MVC that returns Excel ".xlsx" document. In order to build the service we need the following Java classes and XML files:

- **Controller.java**: Java class that receives mapped HTTP request.
- **Link.java**: Simple Java class to be used as model object holding links data.
- **ExcelXlsxView**: Java class extending [`AbstractXlsxView`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/servlet/view/document/AbstractXlsxView.htm) and generating the actual Excel document.
- **view.xml**: XML file containing Excel view class configuration.
- **rest-servlet.xml**: Spring XML configuration file containing configuration of controllers and view resolvers. 

![spring-mvc-excel-view-structure]({{ "http://hmkcode.github.io/images/spring/spring-mvc-excel-view-structure.png" | spring-mvc-excel-view-structure }})



## Dependencies 

To develop and run the service you need the following libraries:

* Spring core, context, beans, expression, webmvc, web.
* Apache common logging 
* Apache POI 
* Apache POI OOXML

Complete Maven dependencies is included in [`pom.xml`](https://github.com/hmkcode/Spring-Framework/blob/master/spring-mvc-excel-view/pom.xml)

## Project Structure

![spring-mvc-excel-view-project]({{ "http://hmkcode.github.io/images/spring/spring-mvc-excel-view-project.png" | spring-mvc-excel-view-project }})


#### `Controller.java`

<pre style='color:#000000;background:#f1f0f0;'><span style='color:#400000; font-weight:bold; '>package</span><span style='color:#004a43; '> com</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>hmkcode</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>controllers</span><span style='color:#806030; '>;</span>

<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> java</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>util</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>LinkedList</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> java</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>util</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>List</span><span style='color:#806030; '>;</span>

<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>springframework</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>web</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>bind</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>annotation</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>RequestMapping</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>springframework</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>web</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>bind</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>annotation</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>RequestMethod</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>springframework</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>web</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>bind</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>annotation</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>RestController</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>springframework</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>web</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>servlet</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>ModelAndView</span><span style='color:#806030; '>;</span>

<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> com</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>hmkcode</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>model</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>Link</span><span style='color:#806030; '>;</span>

@RestController
<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#400000; font-weight:bold; '>class</span> Controller <span style='color:#806030; '>{</span>
	
	<span style='color:#806030; '>@</span>RequestMapping<span style='color:#806030; '>(</span>value <span style='color:#806030; '>=</span> <span style='color:#e60000; '>"/viewExcel"</span><span style='color:#806030; '>,</span> method <span style='color:#806030; '>=</span> RequestMethod<span style='color:#806030; '>.</span>GET<span style='color:#806030; '>)</span>
	<span style='color:#400000; font-weight:bold; '>public</span> ModelAndView getExcel<span style='color:#806030; '>(</span><span style='color:#806030; '>)</span><span style='color:#806030; '>{</span>
		<span style='color:#800040; '>System</span><span style='color:#806030; '>.</span>out<span style='color:#806030; '>.</span>println<span style='color:#806030; '>(</span><span style='color:#e60000; '>"getExcel!"</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
		
		<span style='color:#800040; '>List</span><span style='color:#806030; '>&lt;</span>Link<span style='color:#806030; '>></span> links <span style='color:#806030; '>=</span> <span style='color:#400000; font-weight:bold; '>new</span> LinkedList<span style='color:#806030; '>&lt;</span>Link<span style='color:#806030; '>></span><span style='color:#806030; '>(</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
		links<span style='color:#806030; '>.</span>add<span style='color:#806030; '>(</span><span style='color:#400000; font-weight:bold; '>new</span> Link<span style='color:#806030; '>(</span><span style='color:#e60000; '>"Android"</span><span style='color:#806030; '>,</span> <span style='color:#e60000; '>"android.com"</span><span style='color:#806030; '>)</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
		links<span style='color:#806030; '>.</span>add<span style='color:#806030; '>(</span><span style='color:#400000; font-weight:bold; '>new</span> Link<span style='color:#806030; '>(</span><span style='color:#e60000; '>"Spring"</span><span style='color:#806030; '>,</span> <span style='color:#e60000; '>"spring.io"</span><span style='color:#806030; '>)</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
		links<span style='color:#806030; '>.</span>add<span style='color:#806030; '>(</span><span style='color:#400000; font-weight:bold; '>new</span> Link<span style='color:#806030; '>(</span><span style='color:#e60000; '>"Firebase"</span><span style='color:#806030; '>,</span> <span style='color:#e60000; '>"firebase.com"</span><span style='color:#806030; '>)</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
		
		<span style='color:#400000; font-weight:bold; '>return</span> <span style='color:#400000; font-weight:bold; '>new</span> ModelAndView<span style='color:#806030; '>(</span><span style='color:#e60000; '>"ExcelXlsxView"</span><span style='color:#806030; '>,</span> <span style='color:#e60000; '>"model"</span><span style='color:#806030; '>,</span> links<span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
	<span style='color:#806030; '>}</span>

<span style='color:#806030; '>}</span>
</pre>

#### `ExcelXlsxView.java`

<pre style='color:#000000;background:#f1f0f0;'><span style='color:#400000; font-weight:bold; '>package</span><span style='color:#004a43; '> com</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>hmkcode</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>view</span><span style='color:#806030; '>;</span>

<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> java</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>util</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>List</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> java</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>util</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>Map</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> javax</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>servlet</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>http</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>HttpServletRequest</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> javax</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>servlet</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>http</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>HttpServletResponse</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>apache</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>poi</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>ss</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>usermodel</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>Row</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>apache</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>poi</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>ss</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>usermodel</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>Sheet</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>apache</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>poi</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>ss</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>usermodel</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>Workbook</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> org</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>springframework</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>web</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>servlet</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>view</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>document</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>AbstractXlsxView</span><span style='color:#806030; '>;</span>
<span style='color:#400000; font-weight:bold; '>import</span><span style='color:#004a43; '> com</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>hmkcode</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>model</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>Link</span><span style='color:#806030; '>;</span>

<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#400000; font-weight:bold; '>class</span> ExcelXlsxView <span style='color:#400000; font-weight:bold; '>extends</span> AbstractXlsxView <span style='color:#806030; '>{</span>

	<span style='color:#806030; '>@</span>Override
	<span style='color:#400000; font-weight:bold; '>protected</span> <span style='color:#800040; '>void</span> buildExcelDocument<span style='color:#806030; '>(</span>Map<span style='color:#806030; '>&lt;</span><span style='color:#800040; '>String</span><span style='color:#806030; '>,</span> <span style='color:#800040; '>Object</span><span style='color:#806030; '>></span> model<span style='color:#806030; '>,</span> 
			Workbook workbook<span style='color:#806030; '>,</span> 
			HttpServletRequest request<span style='color:#806030; '>,</span>
			HttpServletResponse response<span style='color:#806030; '>)</span> <span style='color:#400000; font-weight:bold; '>throws</span> <span style='color:#800040; '>Exception</span> <span style='color:#806030; '>{</span>
		
		<span style='color:#806030; '>@</span>SuppressWarnings<span style='color:#806030; '>(</span><span style='color:#e60000; '>"unchecked"</span><span style='color:#806030; '>)</span>
		<span style='color:#800040; '>List</span><span style='color:#806030; '>&lt;</span>Link<span style='color:#806030; '>></span> links <span style='color:#806030; '>=</span> <span style='color:#806030; '>(</span><span style='color:#800040; '>List</span><span style='color:#806030; '>&lt;</span>Link<span style='color:#806030; '>></span><span style='color:#806030; '>)</span> model<span style='color:#806030; '>.</span>get<span style='color:#806030; '>(</span><span style='color:#e60000; '>"model"</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
	         
        <span style='color:#c34e00; '>// create a new Excel sheet</span>
        Sheet sheet <span style='color:#806030; '>=</span> workbook<span style='color:#806030; '>.</span>createSheet<span style='color:#806030; '>(</span><span style='color:#e60000; '>"Sheet"</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>

        <span style='color:#800040; '>int</span> i <span style='color:#806030; '>=</span> <span style='color:#c00000; '>0</span><span style='color:#806030; '>;</span>
        Row row <span style='color:#806030; '>=</span> <span style='color:#400000; font-weight:bold; '>null</span><span style='color:#806030; '>;</span>
        <span style='color:#400000; font-weight:bold; '>for</span><span style='color:#806030; '>(</span>Link link<span style='color:#806030; '>:</span>links<span style='color:#806030; '>)</span><span style='color:#806030; '>{</span>
        	row <span style='color:#806030; '>=</span> sheet<span style='color:#806030; '>.</span>createRow<span style='color:#806030; '>(</span>i<span style='color:#806030; '>+</span><span style='color:#806030; '>+</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
        	row<span style='color:#806030; '>.</span>createCell<span style='color:#806030; '>(</span><span style='color:#c00000; '>0</span><span style='color:#806030; '>)</span><span style='color:#806030; '>.</span>setCellValue<span style='color:#806030; '>(</span>link<span style='color:#806030; '>.</span>getTitle<span style='color:#806030; '>(</span><span style='color:#806030; '>)</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
        	row<span style='color:#806030; '>.</span>createCell<span style='color:#806030; '>(</span><span style='color:#c00000; '>1</span><span style='color:#806030; '>)</span><span style='color:#806030; '>.</span>setCellValue<span style='color:#806030; '>(</span>link<span style='color:#806030; '>.</span>getUrl<span style='color:#806030; '>(</span><span style='color:#806030; '>)</span><span style='color:#806030; '>)</span><span style='color:#806030; '>;</span>
        <span style='color:#806030; '>}</span>
	<span style='color:#806030; '>}</span>
<span style='color:#806030; '>}</span>
</pre>


#### `Link.java`


<pre style='color:#000000;background:#f1f0f0;'><span style='color:#400000; font-weight:bold; '>package</span><span style='color:#004a43; '> com</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>hmkcode</span><span style='color:#806030; '>.</span><span style='color:#004a43; '>model</span><span style='color:#806030; '>;</span>

<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#400000; font-weight:bold; '>class</span> Link <span style='color:#806030; '>{</span>

	<span style='color:#400000; font-weight:bold; '>private</span> <span style='color:#800040; '>String</span> title<span style='color:#806030; '>;</span>
	<span style='color:#400000; font-weight:bold; '>private</span> <span style='color:#800040; '>String</span> url<span style='color:#806030; '>;</span>
	
	<span style='color:#400000; font-weight:bold; '>public</span> Link<span style='color:#806030; '>(</span><span style='color:#800040; '>String</span> title<span style='color:#806030; '>,</span> <span style='color:#800040; '>String</span> url<span style='color:#806030; '>)</span><span style='color:#806030; '>{</span>
		<span style='color:#400000; font-weight:bold; '>this</span><span style='color:#806030; '>.</span>title <span style='color:#806030; '>=</span> title<span style='color:#806030; '>;</span>
		<span style='color:#400000; font-weight:bold; '>this</span><span style='color:#806030; '>.</span>url <span style='color:#806030; '>=</span> url<span style='color:#806030; '>;</span>
	<span style='color:#806030; '>}</span>
	<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#800040; '>String</span> getTitle<span style='color:#806030; '>(</span><span style='color:#806030; '>)</span> <span style='color:#806030; '>{</span>
		<span style='color:#400000; font-weight:bold; '>return</span> title<span style='color:#806030; '>;</span>
	<span style='color:#806030; '>}</span>
	<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#800040; '>void</span> setTitle<span style='color:#806030; '>(</span><span style='color:#800040; '>String</span> title<span style='color:#806030; '>)</span> <span style='color:#806030; '>{</span>
		<span style='color:#400000; font-weight:bold; '>this</span><span style='color:#806030; '>.</span>title <span style='color:#806030; '>=</span> title<span style='color:#806030; '>;</span>
	<span style='color:#806030; '>}</span>
	<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#800040; '>String</span> getUrl<span style='color:#806030; '>(</span><span style='color:#806030; '>)</span> <span style='color:#806030; '>{</span>
		<span style='color:#400000; font-weight:bold; '>return</span> url<span style='color:#806030; '>;</span>
	<span style='color:#806030; '>}</span>
	<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#800040; '>void</span> setUrl<span style='color:#806030; '>(</span><span style='color:#800040; '>String</span> url<span style='color:#806030; '>)</span> <span style='color:#806030; '>{</span>
		<span style='color:#400000; font-weight:bold; '>this</span><span style='color:#806030; '>.</span>url <span style='color:#806030; '>=</span> url<span style='color:#806030; '>;</span>
	<span style='color:#806030; '>}</span>
	<span style='color:#806030; '>@</span>Override
	<span style='color:#400000; font-weight:bold; '>public</span> <span style='color:#800040; '>String</span> toString<span style='color:#806030; '>(</span><span style='color:#806030; '>)</span> <span style='color:#806030; '>{</span>
		<span style='color:#400000; font-weight:bold; '>return</span> <span style='color:#e60000; '>"Link [title="</span> <span style='color:#806030; '>+</span> title <span style='color:#806030; '>+</span> <span style='color:#e60000; '>", url="</span> <span style='color:#806030; '>+</span> url <span style='color:#806030; '>+</span> <span style='color:#e60000; '>"]"</span><span style='color:#806030; '>;</span>
	<span style='color:#806030; '>}</span>
<span style='color:#806030; '>}</span>
</pre>

#### `views.xml`

<pre style='color:#000000;background:#f1f0f0;'><span style='color:#004a43; '>&lt;?</span><span style='color:#400000; font-weight:bold; '>xml</span><span style='color:#004a43; '> </span><span style='color:#074726; '>version</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#007d45; '>1.0</span><span style='color:#800000; '>"</span><span style='color:#004a43; '> </span><span style='color:#074726; '>encoding</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>UTF-8</span><span style='color:#800000; '>"</span><span style='color:#004a43; '>?></span>
<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>beans</span> <span style='color:#00dddd; '>xmlns</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.springframework.org</span><span style='color:#40015a; '>/schema/beans</span><span style='color:#800000; '>"</span>
    <span style='color:#00dddd; '>xmlns</span><span style='color:#806030; '>:</span><span style='color:#074726; '>xsi</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.w3.org</span><span style='color:#40015a; '>/2001/XMLSchema-instance</span><span style='color:#800000; '>"</span>
    <span style='color:#00dddd; '>xsi</span><span style='color:#806030; '>:</span><span style='color:#074726; '>schemaLocation</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.springframework.org</span><span style='color:#40015a; '>/schema/beans</span><span style='color:#e60000; '></span>
<span style='color:#e60000; '>&#xa0;</span><span style='color:#e60000; '> </span><span style='color:#e60000; '> </span><span style='color:#e60000; '> </span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.springframework.org</span><span style='color:#40015a; '>/schema/beans/spring-beans-3.0.xsd</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>></span>
     
    <span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>bean</span> <span style='color:#074726; '>id</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>ExcelXlsxView</span><span style='color:#800000; '>"</span> <span style='color:#074726; '>class</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>com.hmkcode.view.ExcelXlsxView</span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>/></span>
     
<span style='color:#a65700; '>&lt;/</span><span style='color:#5f5035; '>beans</span><span style='color:#a65700; '>></span>
</pre>


#### `rest-servlet.xml`

<pre style='color:#000000;background:#f1f0f0;'><span style='color:#004a43; '>&lt;?</span><span style='color:#400000; font-weight:bold; '>xml</span><span style='color:#004a43; '> </span><span style='color:#074726; '>version</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#007d45; '>1.0</span><span style='color:#800000; '>"</span><span style='color:#004a43; '> </span><span style='color:#074726; '>encoding</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>UTF-8</span><span style='color:#800000; '>"</span><span style='color:#004a43; '>?></span>
<span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>beans</span> <span style='color:#00dddd; '>xmlns</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.springframework.org</span><span style='color:#40015a; '>/schema/beans</span><span style='color:#800000; '>"</span>
    <span style='color:#00dddd; '>xmlns</span><span style='color:#806030; '>:</span><span style='color:#074726; '>xsi</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.w3.org</span><span style='color:#40015a; '>/2001/XMLSchema-instance</span><span style='color:#800000; '>"</span>
    <span style='color:#00dddd; '>xsi</span><span style='color:#806030; '>:</span><span style='color:#074726; '>schemaLocation</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.springframework.org</span><span style='color:#40015a; '>/schema/beans</span><span style='color:#e60000; '></span>
<span style='color:#e60000; '>&#xa0;</span><span style='color:#e60000; '> </span><span style='color:#e60000; '> </span><span style='color:#e60000; '> </span><span style='color:#00dddd; '>http</span><span style='color:#806030; '>:</span><span style='color:#400000; font-weight:bold; '>//</span><span style='color:#5555dd; '>www.springframework.org</span><span style='color:#40015a; '>/schema/beans/spring-beans-3.0.xsd</span><span style='color:#800000; '>"</span><span style='color:#a65700; '>></span>
     
    <span style='color:#a65700; '>&lt;</span><span style='color:#5f5035; '>bean</span> <span style='color:#074726; '>id</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>ExcelXlsxView</span><span style='color:#800000; '>"</span> <span style='color:#074726; '>class</span><span style='color:#806030; '>=</span><span style='color:#800000; '>"</span><span style='color:#e60000; '>com.hmkcode.view.ExcelXlsxView</span><span style='color:#800000; '>"</span> <span style='color:#a65700; '>/></span>
     
<span style='color:#a65700; '>&lt;/</span><span style='color:#5f5035; '>beans</span><span style='color:#a65700; '>></span>
</pre>


## Running the Service

`pom.xml` includes **jetty** server as a plug-in. To run the service type the following command 

<pre style='color:#000000;background:#f1f0f0;'><span style='color:#806030; '>></span>mvn jetty<span style='color:#806030; '>:</span>run
</pre>


![spring-mvc-excel-view-running]({{ "http://hmkcode.github.io/images/spring/spring-mvc-excel-view-running.png" | spring-mvc-excel-view-running }})


## Output 

The service response will contain an Excel document ".xlsx". The content of the document will be as shown below. 

![spring-mvc-excel-view-output]({{ "http://hmkcode.github.io/images/spring/spring-mvc-excel-view-output.png" | spring-mvc-excel-view-output }})


### Source Code @ [GitHub](https://github.com/hmkcode/Spring-Framework/tree/master/spring-mvc-excel-view)
