---
layout: post
title:  "Java | Servlet Sending & Receiving JSON Using jQuery.ajax()"
date:   2018-08-17 10:00:00
categories: 
description: "A complete working Java project showing how to use jQuery to send and receive JSON in the frontend and how to receive and send JSON using a Java servlet running in the backend."
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/2013/07/java-servlet-json.jpg">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/2013/07/java-servlet-json.jpg" alt="java-servlet-json" />
	</a>
	
	A complete working Java project showing how to use jQuery ajax function to send an HTTP POST request with JSON content in the request body to the backend and how to receive and parse JSON in the frontend using jQuery. In the backend a Java servlet is running to receive POST request, read the JSON content, map it to Java object, add the received content to a list and again send the complete list to the fontend in JSON format. 
	
</p>

## Objectives

- How to send jQuery.ajax() POST request with data in JSON format?
- How to receive JSON data in Java servlet, parse it and map it into Java objects?
- How to send data back to the client in JSON format?


## Overview
We will build a simple Java servlet using `@WebServlet`. The servlet recieves POST request, reads JSON content, maps it into `Article` Java object using Jackson and finally sends a list of received articles in the response body to the frontend in JSON format. In the frontend we will have a single HTML file and JS file with a single function **sendPost** that sends HTTP POST request and recieves JSON contnet on success. 

![java-servlet-json]({{ "https://hmkcode.github.io/images/java/java-servlet-json.png" | absolute_url }})

`JSONServlet.java`: Java servlet that receives POST request with JSON content and send back JSON content in response body.
`Article.java`: Java class for creating an object holding article's title, url, tags and categories.
`index.html`: HTML file for entering article info to be sent and displaying articles list received from backend. 
`myfunctions.js`: JS file with one function **sendPost** for sending ajax POST request with article info in JSON format and receiving a list of articles from the backend in JSON format.
`pom.xml`: Maven pom.xml file listing dependencies and plugin used for this project.

## Dependencies

- **Jackson** `<version>2.9.6</version>`
- **Jetty** plugin for running the project.

```xml

<dependencies>
	<dependency>
		<groupId>javax.servlet</groupId>
		<artifactId>javax.servlet-api</artifactId>
		<version>3.1.0</version>
		<scope>provided</scope>
	</dependency>
	
	<!-- Jackson -->
	<dependency>
		<groupId>com.fasterxml.jackson.core</groupId>
		<artifactId>jackson-core</artifactId>
		<version>2.9.6</version>
	</dependency>
	<dependency>
		<groupId>com.fasterxml.jackson.core</groupId>
		<artifactId>jackson-databind</artifactId>
		<version>2.9.6</version>
	</dependency>
	<dependency>
		<groupId>com.fasterxml.jackson.core</groupId>
		<artifactId>jackson-annotations</artifactId>
		<version>2.9.6</version>
	</dependency>
</dependencies>


<plugins>
	<plugin>
		<groupId>org.eclipse.jetty</groupId>
		<artifactId>jetty-maven-plugin</artifactId>
		<version>9.4.11.v20180605</version>	
	</plugin>
</plugins>

```


## Backend

**`JSONServlet.java`**

- Use servlet annotations `@WebServlet("/jsonservlet")`
- Extends `HttpServlet`
- Override `doPost()`
 1. get received JSON data from request
 2. initiate jackson mapper
 3. Convert received JSON to Article
 4. Set response type to JSON
 5. Add article to List<Article>
 6. Send List<Article> as JSON to client

```java
package com.hmkcode;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hmkcode.vo.Article;

@WebServlet("/jsonservlet")
public class JSONServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	// This will store all received articles
	List<Article> articles = new LinkedList<Article>();
	
	/***************************************************
	 * URL: /jsonservlet
	 * doPost(): receives JSON data, parse it, map it and send back as JSON
	 ****************************************************/
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException{
	    
		// 1. get received JSON data from request
		BufferedReader br = 
		new BufferedReader(new InputStreamReader(request.getInputStream()));
		
		String json = "";
		if(br != null){
			json = br.readLine();
			System.out.println(json);
		}
		
		// 2. initiate jackson mapper
		ObjectMapper mapper = new ObjectMapper();
    	
		// 3. Convert received JSON to Article
		Article article = mapper.readValue(json, Article.class);

		// 4. Set response type to JSON
		response.setContentType("application/json");		    
    	
		// 5. Add article to List<Article>
		articles.add(article);

		// 6. Send List<Article> as JSON to client
		mapper.writeValue(response.getOutputStream(), articles);
	}
}
```

**`Article.java`**

```java
package com.hmkcode.vo;

import java.util.LinkedList;
import java.util.List;

public class Article {

	private String title;
	private String url;
	private List<String> categories;
	private List<String> tags;
	
	//setters & getters
}
```

## Frontend

**`index.html`**

```html
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>Java Servlet JSON</title>
<script src="js/jquery.1.9.1.min.js"></script>

<!-- bootstrap just to have good looking page -->
<link href="bootstrap/css/bootstrap.css" type="text/css" rel="stylesheet" />

<!-- we code these -->
<script src="js/myfunctions.js"></script>


</head>

<body>

	<h1 style="text-align:center">Java Servlet Send & Receive JSON<br></h1> 
	
	<!-- article inputs -->
	<div class="article" style="margin:10px;">
		<div class="input-prepend">
			<span class="add-on">Title</span>
			<input class="span4" id="title" name="title" 
				type="text" placeholder="Article Title...">
		</div>		
		<br/>
		
		<div class="input-prepend">
			<span class="add-on">URL</span>
			<input class="span4" id="url" name="url" 
				type="text" placeholder="http://...">
		</div>		
		<br/>
		
		<div class="input-prepend">
			<span class="add-on">Categories</span>
			<input class="span2" id="categories" name="categories" 
				type="text" placeholder="category1;category2;...">
		</div>
		<br/>
		
		<div class="input-prepend">
			<span class="add-on">Tags</span>
			<input class="span2" id="tags" name="tags"
				type="text" placeholder="tag1;tag2;...">
		</div>
		<p>
			<button class="btn btn-primary" 
				type="button" onclick="sendAjax()">Add</button>
		</p>
	</div>
	
	<!-- display all articles -->
	<div style="width:700px;padding:20px;S">
		<h5 style="text-align:center">
			<i style="color:#ccc"><small>Articles</small></i>
		</h5>
	
		<table id="added-articles" class="table">
			<tr>
				<th>Title</th>
				<th>Categories</th>
				<th>Tags</th>
			</tr>
		</table>
	</div>
</body> 
</html>
```
**`myfunctions.js`**

```js
function sendAjax() {
 
	// get inputs
	var article = new Object();
	article.title = $('#title').val();
	article.url = $('#url').val();
	article.categories = $('#categories').val().split(";");
	article.tags = $('#tags').val().split(";");
	
	$.ajax({
		url: "jsonservlet",
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(article),
		contentType: 'application/json',
		mimeType: 'application/json',
		
		success: function (data) {
        	$("tr:has(td)").remove();

        	$.each(data, function (index, article) {
            	
                var td_categories = $("<td/>");
                $.each(article.categories, function (i, tag) {
                	var span = $("<span class='label label-info' 
						style='margin:4px;padding:4px' />");
						
                	span.text(tag);
                	td_categories.append(span);
                });
                
                var td_tags = $("<td/>");
                $.each(article.tags, function (i, tag) {
                	var span = $("<span class='label' 
						style='margin:4px;padding:4px' />");
                	span.text(tag);
                	td_tags.append(span);
                });
                
                $("#added-articles").append($('<tr/>')
                	.append($('<td/>')
				.html("<a href='"+article.url+"'>"+article.title+"</a>"))
                	.append(td_categories)
                	.append(td_tags)
                );
            
                
            }); 
        },
		error:function(data,status,er) {
			alert("error: "+data+" status: "+status+" er:"+er);
		}
	});
}
```

## Run

- Clone the repoistory from github and use maven to run the project.

<pre>
	java-servlet-json>mvn jetty:run
</pre>

![java-servlet-json]({{ "https://hmkcode.github.io/images/java/java-servlet-json-index.png" | absolute_url }})


### Source Code @ [GitHub](https://github.com/hmkcode/Java/tree/master/java-servlet-json)

