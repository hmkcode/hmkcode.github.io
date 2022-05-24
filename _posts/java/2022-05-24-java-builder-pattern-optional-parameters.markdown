---
layout: post
title:  "Java | Builder Pattern for Optional Parameters"
date:   2022-05-24 12:00:00
categories: java
description: Classes that have many optional parameters can use builder pattern to create instances of these classes. 
---


![effective-java-item-2.png]({{ "/images/java/effective-java-item-2.png" }})


> "Consider a builder when faced with many constructor parameters" ~ Joshua Block's, Effective Java 

Classes that have many optional parameters can use builder pattern to create instances of these classes according to Joshua Block's Effective Java Item-2. 

## How to Create Instances of Classes with Many Optional Parameters?

- For example, we have `Mobile.java` class that has one required parameter and many optional ones.

```java
public class Mobile {
	
	String brand;  //required
	String model;  
	String color;
	double display;
	double price;
}
```

- To create an instance of this class we can have a constructor that accepts all parameters. While this seems to be a simple solution, it will require the passing of values for parameters that might not needed. 

```java
public Mobile(String brand, String model, String color, double display, double price) {
		this.brand = brand;
		this.model = model;
		this.color = color;
		this.display = display;
		this.price = price;
	}
```

- Another way is to write a constructor or "static factory method" for each possible case. However, this way might not be practical and will be faced with the language restriction of not allowing more than one constructor with the same signature. 

```java
public Mobile(String brand, String model) {
		this.brand = brand;
		this.model = model;
	}

// not allowed! we already have a constructor with similar signature
public Mobile(String brand, String color) {
		this.brand = brand;
		this.color = color;
	}
```

- A third possible solution is JavaBean in which we call default constructor "that has no parameters" and then set parameters using setter methods. However, since the creation of an instance needs multiple calls we need to ensure thread safety and consistency of passed values. 

```java
Mobile mobile = new Mobile();
mobile.setBrand("Apple");
mobile.setSize(5.4);
...
```
- An alternative solution that overcomes all the disadvantages of previous ones is **Builder Pattern**

## Builder Pattern

- **Builder pattern** is an efficient way to create instances of classes that have many optional parameters.
- **Builder pattern** has many advantages over other alternative ways e.g. JavaBeans.
- **Builder pattern** works by creating a builder object with required parameters then setter-like methods are called to set optional parameters. The actual instance is created by calling **build()** method. 

```java
Mobile mobile = new Mobile.Builder("Apple").display(5.4).model("iPhone 13").build();
```

```java
public class Mobile {
	
	private String brand;  //required
	private String model;  
	private String color;
	private double display;
	private double price;
	
	// getters
	
	private Mobile(Builder builder) {
		// optional paramters only
		this.model = builder.model;
		this.color = builder.color;
		this.display = builder.display;
		this.price = builder.price;
	}

	
	public static class Builder{
		//required
		private String brand;
		
		// optional 
		private String model;  
		private String color;
		private double display;
		private double price;
		
		public Builder(String brand) {
			this.brand = brand;
		}
		
		// optional parameters setters
		public Builder model(String model) {
			this.model = model;
			return this;
		}
		public Builder color(String color) {
			this.color = color;
			return this;
		}
		public Builder display(double display) {
			this.display = display;
			return this;
		}
		public Builder price(double price) {
			this.price = price;
			return this;
		}
		
		// build 
		public Mobile build() {
			return new Mobile(this);
		}
	}
}
```
