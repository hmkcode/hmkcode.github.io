---
layout: post
title:  "Java | Simple Jasper Report Example"
date:   2020-04-25 12:00:00
categories: java
description: JasperReports library is an open source reporting library written in Java. The library can export documents in different formats e.g. PDF, HTML, CSV...etc. This post shows a simple example of how to export PDF document using JasperReports. 
---


![java-jasper.jpg]({{ "/images/java/java-jasper.jpg" | absolute_url }})

JasperReports library is an open source reporting library written in Java. The library can export documents in different formats e.g. PDF, HTML, CSV...etc. This post shows a simple example of how to export PDF document using JasperReports. 

### Environment, Tools &amp; Libraries _used in this post_

- Maven (build tool)
- **jasperreports** 6.10.0
- **spring core** 5.2.3.RELEASE

## **Overview**

![java-jasper-input.png]({{ "/images/java/java-jasper-input.png" 
| absolute_url }})

In order to generate a report we need to following inputs to be passed to Jasper exporting functions:

- **Jasper Report Template:** Jasper template is an XML `.jrxml` file that can be created using [JasperSoft Studio](https://community.jaspersoft.com/project/jaspersoft-studio).
- **Parameters:** This is a Java `Map` object containing a set of values passed from the application requesting the report. They can be used for runtime configuration or to pass additional custom data that is not part of the data source.
- **Datasource:** JasperReport engines expect an object of type `JRDataSource` as a data source. There several implementations of `JRDataSource` that allow to fetch data from different data source types such as databases, XML file, CSV file or Java beans.


In this post will export a PDF file using a `List` of Java bean `Country` as a data source. The template we are going to use `report.jrxml` is created using JasperSoft Studio. 

## Dependencies

**pom.xml**

```xml
<dependencies>
    <dependency>
      <groupId>net.sf.jasperreports</groupId>
      <artifactId>jasperreports</artifactId>
      <version>6.10.0</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/org.springframework/spring-core -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
      <version>5.2.3.RELEASE</version>
    </dependency>

  </dependencies>
```



## Java Bean `Country.java`

- We have one simple Java class `Country` that holds country's code, name and URL to an image of the contry's flag. 

```java
public class Country {

    private String code;
    private String name;
    private String url;

    public Country(String code, String name, String url) {
        this.code = code;
        this.name = name;
        this.url = url;
    }
    ...
}
```


## Java `App.java`

- The `App.java` class contains the **main()** method.
- The **main()** method call 3 custom methods
 1. **getJasperReport()** read & compiles `.jrxml` file.
 2. **getParameters()** returns the set of parameters.
 3. **getDataSource()** builds the data source .


```java
package com.hmkcode;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.util.*;

public class App 
{
    // name and destination of output file e.g. "report.pdf"
    private static String destFileName = "report.pdf";

    public static void main( String[] args ) throws FileNotFoundException, JRException {

        System.out.println( "generating jasper report..." );

        // 1. compile template ".jrxml" file
        JasperReport jasperReport = getJasperReport();

        // 2. parameters "empty"
        Map<String, Object> parameters = getParameters();

        // 3. datasource "java object"
        JRDataSource dataSource = getDataSource();

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, 
                parameters, 
                dataSource);
        JasperExportManager.exportReportToPdfFile(jasperPrint, destFileName);

    }

    private static JasperReport getJasperReport() throws FileNotFoundException, JRException {
        File template = ResourceUtils.getFile("classpath:report.jrxml");
        return JasperCompileManager.compileReport(template.getAbsolutePath());
    }
    private static Map<String, Object> getParameters(){
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "hmkcode");
        return parameters;
    }

    private static JRDataSource getDataSource(){

        List<Country> countries = new LinkedList<>();

        countries.add(new Country("IS", "Iceland", 
            "https://i.pinimg.com/originals/72/b4/49/72b44927f220151547493e528a332173.png"));

        // 9 other countries in GITHUB

        return new JRBeanCollectionDataSource(countries);
    }
}
```


### Source Code @ [GitHub](https://github.com/hmkcode/Java/tree/master/java-jasper)
