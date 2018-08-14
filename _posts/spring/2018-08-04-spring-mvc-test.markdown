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


- `Controller.java` : Simple Spring MVC controller responding to GET request mapped to **/rest/api/get**.
- `Link.java`: Simple Java model class.
- `rest-servlet`: Spring XML configuration file.
- `web.xml`: Defining **DispatcherServlet**.
- `index.html`: HTML file with one link calling REST service.
- `TestController`: Test class for testing our controller.
- `rest-servlet-test.xml`: Spring Configration for testing. 
- `pom.xml`: Maven pom.xml file listing dependencies and plugin used for this project.

## Dependencies

To develop, run and test the service you need the following libraries:

- **Spring Framework**

**`<spring.version>5.0.8.RELEASE</spring.version>`**

```xml

<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-context</artifactId>
	<version>${spring.version}</version>
</dependency>

<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-core</artifactId>
	<version>${spring.version}</version>
</dependency>

<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-beans</artifactId>
	<version>${spring.version}</version>
</dependency>

<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-web</artifactId>
	<version>${spring.version}</version>
</dependency>

<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-webmvc</artifactId>
	<version>${spring.version}</version>
</dependency>

<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-expression</artifactId>
	<version>${spring.version}</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>${spring.version}</version>
    <scope>test</scope>
</dependency>
```

- **jUnit**

**`<junit.version>4.12</junit.version>`**

```xml
<dependency>
	<groupId>junit</groupId>
	<artifactId>junit</artifactId>
	<version>${junit.version}</version>
	<scope>test</scope>
</dependency>
```

- **hamcrest && jsonpath**

Hamcrest and JSON path will be used to assert JSON results

```xml
<dependency>
	<groupId>org.hamcrest</groupId>
	<artifactId>hamcrest-library</artifactId>
	<version>1.3</version>
	<scope>test</scope>
</dependency>
<dependency>
	<groupId>com.jayway.jsonpath</groupId>
	<artifactId>json-path</artifactId>
	<version>2.2.0</version>
	<scope>test</scope>
</dependency>
```

Complete Maven dependencies is included in [`pom.xml`](https://github.com/hmkcode/Spring-Framework/blob/master/spring-mvc-test/pom.xml)


## Spring MVC Controller

We will build a simple controller that returns JSON. The service will return a single `Link` object in json format. 

**`Controller.java`**

```java
package com.hmkcode.controllers;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.hmkcode.model.Link;

@RestController
@RequestMapping("api")
public class Controller {
	
	@RequestMapping(value = "/get", method = RequestMethod.GET)
	public @ResponseBody Link get(){
		System.out.println("Get!");
		
		Link link = new Link();
		link.setTitle("HMKCODE BLOG!");
		link.setUrl("hmkcode.com");
		
		return link;
		
	}
}
```

**`Link.java`**

```java

package com.hmkcode.model;

public class Link {

	private String title;
	private String url;

	// setters & getters
}
```

[**`rest-servlet.xml`**](https://github.com/hmkcode/Spring-Framework/blob/master/spring-mvc-test/src/main/webapp/WEB-INF/rest-servlet.xml) 
[**`web.xml`**](https://github.com/hmkcode/Spring-Framework/blob/master/spring-mvc-test/src/main/webapp/WEB-INF/web.xml) 
[**`index.html`**](https://github.com/hmkcode/Spring-Framework/blob/master/spring-mvc-test/src/main/webapp/index.html) 

## Spring MVC Test 

**`TestController.java`**

- **@RunWith(SpringJUnit4ClassRunner.class)** will run Spring test.
- **@ContextConfiguration** loads the context configuration in `rest-servlet-test.xml`. 
- **@WebAppConfiguration**  will load the web application context

```java
package com.hmkcode.test;

import javax.servlet.ServletContext;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "/rest-servlet-test.xml")
@WebAppConfiguration
public class TestController {

	@Autowired
	private WebApplicationContext wac;
	
	private MockMvc mockMvc;
	@Before
	public void setup() throws Exception {
	    this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}
	
	@Test
	public void configTest() {
	    ServletContext servletContext = wac.getServletContext();
	     
	    Assert.assertNotNull(servletContext);
	    Assert.assertTrue(servletContext instanceof MockServletContext);
	    Assert.assertNotNull(wac.getBean("controller"));
	}
	
	@Test
	public void test() throws Exception{
		 this.mockMvc.perform(get("/api/get"))
		 	.andExpect(status().isOk())
		 	.andDo(print());
		 
	}
}

```

### Source Code @ [GitHub](https://github.com/hmkcode/Spring-Framework/tree/master/spring-mvc-test)



