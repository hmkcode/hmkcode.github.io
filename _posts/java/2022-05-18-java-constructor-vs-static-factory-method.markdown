---
layout: post
title:  "Java | Constructors vs Static Factory Methods"
date:   2022-05-18 12:00:00
categories: java
description: While using constructors is the default way of creating new objects, using static methods might bring more advantages according to Joshua Block's Effective Java Item-1.
---


![effective-java-item-1.png]({{ "/images/java/effective-java-item-1.png" }})


> "Consider static factory methods instead of constructors" ~ Joshua Block's, Effective Java 

While using constructors is the default way of creating new objects, using static methods might bring more advantages according to Joshua Block's Effective Java Item-1. 

## Using Static Methods Instead of Constructors!

- Controlling the way of creating new objects seems to be a best practice to be considered when programming. 
- One of these ways is _static factory method_, which is simply a static method returning an instance of a class. 

- Java API has many examples of classes using static factory methods e.g. String class

```java
public static String valueOf(Object obj) {
  return (obj == null) ? "null" : obj.toString();
}

String str1 = String.valueOf(1);
String str2 = String.valueOf(true);
String str3 = String.valueOf('a');
```

## Some Advantages of using Static Factory Methods

### 1. Meaningful Names

- Unlike constructors, static factory methods can have meaningful names which describe the functionalities. For example, `Optional` class has static factory method **empty()** that, as the name conveys, return an empty instance. 

```java
public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
}
```

- Also, static factory methods will help to get around the restriction of having multiple constructors with the same signature.

```java
public class User {

	private String name;
	private String address;
	private String type;
	
	public User(String name, String address, String type) {
		
		this.name = name;
		this.address = address;
		this.type = type;
	}
	
	public static User createUserwithDefualtType(String name, String address) {
		return new User(name, address, "Regular");
	}
	
	public static User createUserwithEmptyAddress(String name, String type) {
		return new User(name, "", type);
	}
	
}
```

### 2. Instance Controlled Classes

- Controlling the creation of new instances is achievable with static factory methods.
- Immutable classes can be preconstructed or cached and return them with every invocation without recreating them.
- Static factory methods allow classes to be singleton, non-instantiable and to provide logic to be implemented before returning fully-initialized objects e.g. to check for duplicated instances. 

```java
public class Connection {
    
    private static volatile Connection instance = null;
    
    private Connection(String host, String address) {...}
    
    public static Connection getSingletonInstance(String host, String address) {
        if (instance == null) {
            synchronized (Connection.class) {
                if (instance == null) {
                    instance = new Connection(host, address);
                }
            }
        }
        return instance;
    }
}
```

### 3. Returning Subtypes

- Unlike constructors, static factory methods can return subtypes of the return type. 

```java
interface Shape {

	public static Shape createRectangle(int width, int height) {
		return new Rectangle(width, height);
	}
	
	public static Shape createSquare(int length) {
		return createRectangle(length, length);
	}
	
	public static Shape createCircle(int radius) {
		return new Circle(radius);
	}
}

public class Rectangle implements Shape {

	private int width;
	private int height;
	
	public Rectangle(int width, int height) {
		this.width = width;
		this.height = height;
	}
}

public class Circle implements Shape {

	private int radius;
	
	public Circle(int radius) {
		this.radius = radius;
	}
	
}
```

### 4. Basis of Service Provider Frameworks

- Static factory methods do not need the actual implementation of the returned object to exist immediately!
- This is clear when using service provider frameworks where actual implementation of a service interface does not need to exist at the compile time. 

```java
public interface MyService {
  void doSomething();
}

class MyServiceFactory {
	
  public static MyService getService() throws InstantiationException, IllegalAccessException, ClassNotFoundException {
    
		 return (MyService) Class.forName("MyServiceImplemetation").newInstance();

         // MyServiceImplemetation is not written yet! But the code compile
  }
}

public class App {

	public static void main(String[] args) {
		
		MyServiceFactory.getService().doSomething();

        //... 
    }
			
}
```

```java
class MyServiceImplemetation implements MyService{

	@Override
	public void doSomething() {
		System.out.println("doing something!");
		
	}
	
}
```