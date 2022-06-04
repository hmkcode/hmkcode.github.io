---
layout: post
title:  "Java | How to Enforce Non-Instantiability of a Class?"
date:   2022-06-02 12:00:00
categories: java
description: Interfaces and abstract classes are non-instantiable i.e. we can't directly create instances out of them. Regular classes are instantiable by default, so how to enforce non-instantiability?  
---


![effective-java-item-4.png]({{ "/images/java/effective-java-item-4.png" }})

Interfaces and abstract classes are non-instantiable i.e. we can't directly create instances out of them. Regular classes are instantiable by default, so how to enforce non-instantiability? 

> "Enforce the singleton property with private constructor or an enum type" ~ Joshua Block's, Effective Java 

## Why Do We Need Non-instantiable Classes?

- You may need to have a class that provides static methods and fields e.g. `java.lang.Math`
- Such classes should not be instantiated since their *static* members are accessible without creating an instance.

```java
public final class MyUtility{

    public static void doSomething(){
        // ....
    }
}
```

##  How to Enforce Non-instantiability?  

**No explicit constructor**

- Writing a class with an explicit constructor is the first step but it is not enough since the compiler will implicitly provide the **default constructor**.
- `MyUtility` is still instantiable using the default constructor. 

```java
public static void main(String[] args) {
    new MyUtility();
}
```

**Not abstract**

- Making the class abstract is not enough since abstract class can be extended specially that abstract class is usually designed for inheritance. 

```java
public abstract class MyUtility {

	 public static void doSomething(){
	        // ....
	 }
}

class MySubUtility extends MyUtility{}
```

**Include a private constructor**

- private constructor will prevent the creation of new instances even if it is extended.
- One exception, the call can still be instantiated from within the class. 

```java
public class MyUtility {

	 private MyUtility() {}
	 
	 public static void doSomething(){
	        // ....
	 }
}
```

**Throw an Error**

- To prevent the calling of the constructor from within the class, _throw an error_.

```java
public class MyUtility {

	 private MyUtility() {
         throw new AssertionError();
     }
	 
	 public static void doSomething(){
	        // ....
	 }
}
```
