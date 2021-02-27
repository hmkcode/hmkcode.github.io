---
layout: post
title: "Spring Global Exception Handling Using @ControllerAdvice Annotation"
date: 2021-02-27 12:30:00
categories: spring
description: Spring provides a global exception handling mechanism that can be implemented across the whole application using @ControllerAdvice annotation
---

<p style="text-align: justify;">
	
	<a href="https://hmkcode.github.io/images/spring/spring-exception-handling-controlleradvice.png">
		<img class="size-full wp-image-315 aligncenter" src="https://hmkcode.github.io/images/spring/spring-exception-handling-controlleradvice.PNG" alt="spring-exception-handling" />
	</a>
	
	For several reasons, you may want to a global solution to handle exceptions thrown by controllers across the whole application. Spring provides a mechanism that enables such functionality using <code>@ControllerAdvice</code> annotation.
</p>

## Overview

- We will build a simple Spring Boot application which includes three classes:

![spring-boot-exception](https://hmkcode.github.io/images/spring/spring-exception-handling-controlleradvice-project.PNG "spring-boot-exception")

- `Controller.java` : Simple controller responding to GET requests mapped to **/ok** & **/exception**.
- `ControllerAdvisor.java`: A class annotated with `@ControllerAdvice` to handle exceptions.
- `App.java`: Run the application

## Dependencies

- **Spring Boot**

```xml
<parent>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-parent</artifactId>
	<version>2.4.2</version>
</parent>
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-web</artifactId>
	</dependency>
</dependencies>
```

Complete Maven dependencies is included in [`pom.xml`](https://github.com/hmkcode/Spring-Framework/blob/master/spring-exception-controlleradvice/pom.xml)

## Spring MVC Controller

We will build a simple controller has two services:

- First service `ok()` returns **OK**
- The second service `exception()` throws an `Exception`.

**`Controller.java`**

```java
@RestController
public class Controller {


	 @RequestMapping("/ok")
	 public @ResponseBody String ok() throws Exception {
	  	return "OK";
	 }

	 @RequestMapping("/exception")
	 public @ResponseBody String exception() throws Exception {
	  	throw new Exception("Error");
	 }
}
```

- If we call `/exception`, "before implementing `@ControllerAdvice`" we will see following message

![spring-boot-exception-before](https://hmkcode.github.io/images/spring/spring-exception-handling-controlleradvice-before.png "spring-boot-exception-before")

- Also, notice that the HTTP status code is `500` **Internal Server Error**.

## @ControllerAdvice

- We can handle the previous exception using `@ControllerAdvice` by defining a new class annotated with this annotation.
- Methods of this class can be annotated by `@ExceptionHandler` which defines a single or a list of exceptions types to be handled.
- `@ResponseStatus` is used to override the response status code to be returned by annotated methods.

```java
@ControllerAdvice
public class ControllerAdvisor {


	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)

	public @ResponseBody String generalException(final Exception exception,
			final HttpServletRequest request) {

		return exception.getMessage()+" while calling: "+request.getRequestURI();

	}
}
```

- Now, when calling the `/exception` service, `@ControllerAdvice` class will handle the thrown exception and will set the status code to `400` **Bad Request**.

![spring-boot-exception-before](https://hmkcode.github.io/images/spring/spring-exception-handling-controlleradvice-after.png "spring-boot-exception-after")

### Source Code @ [GitHub](https://github.com/hmkcode/Spring-Framework/tree/master/spring-exception-controlleradvice)
