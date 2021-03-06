---
layout: post
title:  "Gradle for Java"
date:   2018-07-22 09:43:00
categories: gradle

post_img: http://hmkcode.github.io/images/gradle/gradle.png
description: Gradle tutorial for Java developers showing how to use Gradle to automate Java building tasks
---
<p style="text-align: justify;">
	<a href="http://hmkcode.github.io/images/gradle/gradle.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/gradle/gradle.png" alt="get-location" />
	</a>
	<br/>
	This post is a quick Gradle tutorial for Java developers. It shows how to use Gradle to build, test and run Java desktop and web application.
	
</p>


### Table of Content

<div class="post-table-of-content">
	<ul>
	  <li>What is Gradle?</li>
	  <li>Gradle Installation</li>
	  <li>First Gradle Project</li>
	  <li>Gradle Fundamentals</li>
	  <li>Gradle & Java Projects</li>
	  <li>Building Java Application</li>
	  <li>Building Java Web Application</li>
	</ul>
</div>

<!-- 	- Core & Custom Plugin - Repository & Dependencies -->

## What is Gradle?

- **Gradle** is an open-source build tool that helps developers automating building tasks.
- Gradle allows you to write scripts in *Groovy* or *Kotlin* to define **tasks** to be executed on your code.
- Tasks such as compiling, testing or creating jar file can be automated using Gradle.
- Gradle can be used to define **dependencies** or jar files in case of Java to run your code.
- Gradle has a core Java **plugin** that includes many tasks needed for Java development.
- In the case of web application, Gradle can run your web application using **plugin** server.
- Gradle is your best friend!

 
## Gradle Installation

- Gradle can be installed on Linux, macOS, or Windows.
- Gradle requires only a [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) version 7 or higher.
- [Download](https://gradle.org/releases) the latest release. _4.9 is the latest as of now!_
- Follow [installation](https://docs.gradle.org/current/userguide/installation.html#_installing_manually) steps. 
- Verifying installation by running `gradle -v` in command line window.

<pre style='color:#000000;background:#f2f2f2;'>C:\>gradle -v

------------------------------------------------------------
Gradle 4.9
------------------------------------------------------------

Build <span style='color:#2a00ff; '>time:</span>   2018<span style='color:#2a00ff; '>-07-16</span> 08<span style='color:#2a00ff; '>:14:03</span> <span style='color:#2a00ff; '>UTC</span>
Revision:     <span style='color:#2a00ff; '>efcf8c1cf533b03c70f394f270f46a174c738efc</span>

Kotlin <span style='color:#2a00ff; '>DSL:</span>   0.18<span style='color:#2a00ff; '>.4</span>
Kotlin:       1.2<span style='color:#2a00ff; '>.41</span>
Groovy:       2.4<span style='color:#2a00ff; '>.12</span>
Ant:          <span style='color:#2a00ff; '>Apache</span> <span style='color:#2a00ff; '>Ant</span>(TM) <span style='color:#2a00ff; '>version</span> 1.9<span style='color:#2a00ff; '>.11</span> <span style='color:#2a00ff; '>compiled</span> <span style='color:#2a00ff; '>on</span> <span style='color:#2a00ff; '>March</span> 23 2018
JVM:          1.8<span style='color:#2a00ff; '>.0_71</span> (Oracle <span style='color:#2a00ff; '>Corporation</span> 25.71<span style='color:#2a00ff; '>-b15</span>)
OS:           <span style='color:#2a00ff; '>Windows</span> 8.1 6.3 <span style='color:#2a00ff; '>amd64</span>
</pre>

## First Gradle Project

- Create a new directory e.g. `C:\Gradle>first-gradle-project`
- Open command line window and go to the dirctory created in the previous step.
- Type `gradle init`

<pre style='color:#000000;background:#f2f2f2;'>C:\Gradle\first-gradle-project>gradle <span style='color:#2a00ff; '>init</span>
Starting <span style='color:#2a00ff; '>a</span> <span style='color:#2a00ff; '>Gradle</span> <span style='color:#2a00ff; '>Daemon</span>, 1 <span style='color:#2a00ff; '>incompatible</span> <span style='color:#2a00ff; '>and</span> 1 <span style='color:#2a00ff; '>stopped</span> <span style='color:#2a00ff; '>Daemons</span> <span style='color:#2a00ff; '>could</span> <span style='color:#2a00ff; '>not</span> <span style='color:#2a00ff; '>be</span> <span style='color:#2a00ff; '>reused</span>, 
use <span style='color:#2a00ff; '>--status</span> <span style='color:#2a00ff; '>for</span> <span style='color:#2a00ff; '>details</span>

BUILD <span style='color:#2a00ff; '>SUCCESSFUL</span> <span style='color:#2a00ff; '>in</span> <span style='color:#2a00ff; '>11s</span>
2 actionable tasks: 2 executed
</pre>

- Gradle will create new files and sub directories within the parent directory. 
![gradle_init]({{ "http://hmkcode.github.io/images/gradle/gradle_init.png" | absolute_url }})

- `build.gradle` this is the main file where we write scripts in Groovy or Kotlin for Gradle to execute.  
- Open `build.gralde` file in a text editor and type the following script.

```
task hello{
	println "Hello, World!"
}
```

- Open command prompt, go to the project location and type `gradle hello` 

```
C:\Gradle\first-gradle-project>gradle hello
Hello, World!
```

## Gradle Fundamentals

- Everything in Gradle sits on top of two basic concepts: **projects** and **tasks**.
- Every Gradle build is made up of one or more **projects**.
- A **project** represents a thing to be built e.g. JAR file or to be done e.g. deploying to production.
- A **Task** represents a single atomic piece of work for a build, such as compiling classes or generating javadoc.
- Gradle  describes its build using **build file** `build.gradle`.
- Gradle **build file** is located in the root folder of the project. 
- **Build file** defines projects, tasks, plugins, dependencies...ect.
- Gradle uses **plugins** to extend its core functionality.
- For example, the ability to compile Java code is added by a **plugin**.
- Gradle has built-in support for **dependency management** for declaring, resolving and using dependencies required by the project.


## Gradle & Java Projects

- While Gradle can be used with other languages we will focus on using Gradle with Java projects.
- Gradle is a build tool automating the creation of Jar/War build.
- Gradle helps automating a wide variety of tasks such as compiling Java classes, packaging binary code & running Junit tests.
- Gradle allows you to declare dependencies and repositories of Jar files needed for your Java project to compile or run.


## Building Java Application

#### 1. Create new directory

- Create a new directory e.g. `gradle-java-app`
- Go to the directory

```
C:\gradle-projects>mkdir gradle-java-app

C:\gradle-projects>cd gradle-java-app

C:\gradle-projects\gradle-java-app>
```

#### 2. `init` java-application

- To create new Java application call `gradle init --type java-application`

```
C:\gradle-projects\gradle-java-app>gradle init --type java-application

Starting a Gradle Daemon

BUILD SUCCESSFUL in 8s
2 actionable tasks: 2 executed
```

![gradle_init_type_java_application]({{ "http://hmkcode.github.io/images/gradle/gradle_init_type_java_application.png" | absolute_url }})


- Gradle will create `src` folder with two sub-folders `main` and `test`
- `build.gradle` will apply `java` and `application` plugin, point to `guava` lib in **dependencies** and to `jcenter()` repository.

```
plugins {
    id 'java'
    id 'application'
}

mainClassName = 'App'

dependencies {
    compile 'com.google.guava:guava:23.0'
    testCompile 'junit:junit:4.12'
}

repositories {
    jcenter()
}
```

- `App.java` has main method that print **Hello, World!** when executed.

```
public class App {
    public String getGreeting() {
        return "Hello world.";
    }

    public static void main(String[] args) {
        System.out.println(new App().getGreeting());
    }
}
```

#### 3. `build` Java Applicaiton

- To build Java application call `gradle build` task.
- `build` task depends on 6 other tasks such as `compileJava` task.

```
C:\gradle-projects\gradle-java-app>gradle build

BUILD SUCCESSFUL in 0s
7 actionable tasks: 7 up-to-date
```

- To see all executed tasks call `--console=plain build`

#### 4. `run` Java Application

- `build.gradle` is pointing to the main class `mainClassName = 'App'`.
- To run main class call `gradle run`

```
C:\gradle-projects\gradle-java-app>gradle run

> Task :run
Hello world.

BUILD SUCCESSFUL in 0s
2 actionable tasks: 1 executed, 1 up-to-date
```

## Building Java Web Application

#### 1. Create new directory

- Create a new directory e.g. `gradle-java-web-app`
- Go to the directory

```
C:\gradle-projects>mkdir gradle-java-web-app

C:\gradle-projects>cd gradle-java-web-app

C:\gradle-projects\gradle-java-web-app>
```

#### 2. `init` java-application

- So far, there is no init type for java web application, so we will use java-appliation as a starter.
- While `gradle init --type java-application` will not create java web application, it will help creating src and build.gradle file.

```
C:\gradle-projects\gradle-java-web-app>gradle init --type java-application

BUILD SUCCESSFUL in 0s
2 actionable tasks: 2 executed
```

- Change the content of `build.gradle` to be as following
  - use the `war` plugin 
  - and add servlet-api to dependencies

```
plugins {
    id 'war'  
}

repositories {
    jcenter()
}

dependencies {
    providedCompile 'javax.servlet:javax.servlet-api:3.1.0' 
    testCompile 'junit:junit:4.12'
}

```

#### 3. Create a servlet class

- Under `/scr/main/java/com/hmkcode/` create a Java class `HelloServlet.java`


```
package com.hmkcode;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "HelloServlet", urlPatterns = {"hello"}, loadOnStartup = 1) 
public class HelloServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        response.getWriter().print("Hello, World!");  
    }

}
```

#### 4. Add .html file

- Add an index page to the root of the application by creating the file `index.html`.

```
<html>
<head>
  <title>Java Web App</title>
</head>
<body>
<p>Say<a href="hello">Hello</a></p> 

</body>
</html>
```

#### 5. Add the gretty plugin and run the app

- Gretty plugin makes it easy to run or test webapps 

`build.gradle`

```
plugins {
    id 'war'
    id 'org.gretty' version '2.2.0' 
}
```

#### 6. Run the web app

- Use `gradle appRun` to run the web app.

```
C:\gradle-projects\gradle-java-web-app>gradle appRun

```

- Open your web browser and type `http://localhost:8080/gradle-java-web-app/`




