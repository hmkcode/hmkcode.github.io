---
layout: post
title:  "Spring MVC Test Using MockMVC"
date:   2018-08-04 12:30:00
categories: spring
description: The Spring MVC Test framework provides first class support for testing Spring MVC code with JUnit, TestNG, or any other testing framework. The goal of Spring MVC Test is to provide an effective way for testing controllers by performing requests and generating responses through the actual DispatcherServlet.
---


<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/spring/spring.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/spring/spring.png" alt="spring-mvc-view" />
	</a>
	
	The goal of Spring MVC Test is to provide an effective way for testing controllers. Spring MVC Test allows performing requests and generating responses without the need for running in a Servlet container. It uses the DispatcherServlet to provide full Spring MVC runtime behavior and provides support for loading actual Spring configuration with the TestContext framework in addition to a standalone mode in which controllers may be instantiated manually and tested one at a time.
</p>

## Overview

We will build a simple Spring MVC controller that returns JSON content when receiving GET request. In order to build the service we need the following Java classes and XML files:

![spring-mvc-test-files](https://hmkcode.github.io/images/spring/spring-mvc-test-files.png "spring-mvc-test-files")


`Controller.java` : Simple Spring MVC controller responding to GET request mapped to **/rest/api/get**.
`Link.java`: Simple Java model class.
`rest-servlet`: Spring XML configuration file.
`web.xml`: Defining **DispatcherServlet**.
`index.html`: HTML file with one link calling REST service.
`TestController`: Test class for testing our controller.
`rest-servlet-test.xml`: Spring Configration for testing. 
`pom.xml`: Maven pom.xml file listing dependencies and plugin used for this project.


### Source Code @ [GitHub](https://github.com/hmkcode/Spring-Framework/tree/master/spring-mvc-test)



