---
layout: post
title:  "Java | Converting HTML to PDF using iText"
date:   2019-12-05 12:00:00
categories: 
description: Creating a PDF file from HTML can be done using iText Java library. iText has an add-on that enables converting HTML to PDF document. This post shows how to use iText to convert HTML to PDF.
---

<p style="text-align: justify;">
	
	<a href="https://hmkcode.com/images/java/converter-html-to-pdf.png">
		<img class="size-full wp-image-315 aligncenter" src="https://hmkcode.com/images/java/converter-html-to-pdf.png" alt="html to PDF" />
	</a>
	
	Creating a PDF file from HTML can be done using iText Java library. iText has an add-on that enables converting HTML to PDF document. This post shows how to use iText to convert HTML to PDF.
	
</p>

> *"When using iText PDF in a closed source environment, you will need to purchase an iText PDF commercial license."*


### Environment, Tools &amp; Libraries _used in this post_

- Maven (build tool)
- [iText](https://itextpdf.com/en/products/itext-7) 7.1.9
- **pdfHTML** iText PDF Add-On 2.1.6

## Depenedenceis

- We need to add iText core library and **pdfHTML** add-on to our project dependencies.

**pom.xml**

```xm
<dependencies>
    <!-- iText Core -->
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itext7-core</artifactId>
        <version>7.1.9</version>
        <type>pom</type>
    </dependency>

    <!-- iText pdfHTML add-on -->
    <dependency>
	    <groupId>com.itextpdf</groupId>
	    <artifactId>html2pdf</artifactId>
	    <version>2.1.6</version>
	</dependency>
</dependencies>
```

## `HtmlConverter` Class 

- `HtmlConverter` class is the main class to convert HTML to PDF.
- `HtmlConverter` class has three main methods with different inputs and return types:
    - convertToDocument(): returns `Document` instance.
    - convertToElements(): returns a list of iText `IElement` instances.
    - **convertToPdf()**: this method converts HTML to PDF.


## **convertToPdf()** Method

- We will use **convertToPdf()** method from `HtmlConverter` class to convert HTML to PDF.
- **convertToPdf()** has [different variations](https://api.itextpdf.com/pdfHTML/java/2.1.6/com/itextpdf/html2pdf/HtmlConverter.html#method.summary) that takes HTML as `String`, `File` or `InputStream` & writes the PDF content to `File`, `OutputStream` or existing `PdfDocument`. 
- In this post we will use the following variations of the **convertToPdf()** 
    - **convertToPdf**(`String` html, `OutputStream` pdfStream)
    - **convertToPdf**(`InputStream` htmlStream, `OutputStream` pdfStream)
    

## Converting HTML String to PDF

- The simplest example is converting a `String` of HTML to PDF.

```java
package com.hmkcode;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import com.itextpdf.html2pdf.HtmlConverter;

public class App 
{
	public static final String HTML = "<h1>Hello</h1>"
			+ "<p>This was created using iText</p>"
			+ "<a href='hmkcode.com'>hmkcode.com</a>";
	
	
    public static void main( String[] args ) throws FileNotFoundException, IOException  
    {
    	HtmlConverter.convertToPdf(HTML, new FileOutputStream("string-to-pdf.pdf"));
    	
        System.out.println( "PDF Created!" );
    }
}
```

**Output:** The code above will create a PDF file **string-to-pdf.pdf**

![String to PDF]({{ "https://hmkcode.com/images/java/java-itext-html-pdf-hello.jpg" | absolute_url }})


## Converting HTML File to PDF

- We can convert HTML file to PDF using the same method **convertToPdf()** that takes HTML as `InputStream` and write the PDF content into `OutputStream`.
- The HTML file can contain CSS file and images. However, they need to be in the same location of HTML file. If referenced file are located in different directories we need to use `ConverterProperties` to set the base URL. 

**index.html**

```html
<html>
	<head>
		<title>HTML to PDF</title>
		<link href="style.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
		<h1>HTML to PDF</h1>
		<p>
            <span class="itext">itext</span> 7.1.9 
            <span class="description"> converting HTML to PDF</span>
		</p>
		<table>
		  <tr>
				<th class="label">Title</th>
				<td>iText - Java HTML to PDF</td>
			</tr>
			<tr>
				<th>URL</th>
				<td>http://hmkcode.com/itext-html-to-pdf-using-java</td>
			</tr>
		</table>
	</body>
</html>

```

```java
package com.hmkcode;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import com.itextpdf.html2pdf.HtmlConverter;

public class App 
{
	
    public static void main( String[] args ) throws FileNotFoundException, IOException  
    {
    	HtmlConverter.convertToPdf(new FileInputStream("index.html"), 
            new FileOutputStream("index-to-pdf.pdf"));

        System.out.println( "PDF Created!" );
    }
}
```

**Output:** The code above will create a PDF file **string-to-index.pdf**

![HTML to PDF]({{ "https://hmkcode.com/images/java/java-itext-html-pdf-index.jpg" | absolute_url }})


### Source Code @ [GitHub](https://github.com/hmkcode/Java/tree/master/itext-java-html-pdf)

