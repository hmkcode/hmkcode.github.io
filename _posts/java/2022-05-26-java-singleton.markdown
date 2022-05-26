---
layout: post
title:  "Java | Singleton Pattern"
date:   2022-05-26 12:00:00
categories: java
description: Some objects are required to be singleton such as "builder, facade, state, logging, ...etc". Singleton pattern can be used to enforce the creation of exactly one instance of those objects. 
---


![effective-java-item-3.png]({{ "/images/java/effective-java-item-3.png" }})


> "Enforce the singleton property with private constructor or an enum type" ~ Joshua Block's, Effective Java 

Some objects are required to be singleton such as "builder, facade, state, logging, ...etc". Singleton pattern can be used to enforce the creation of exactly one instance of those objects. 

## How to Enforce the Creation of a Single Instance?

There are two common way to implement singleton:

### 1. `private` Constructor with `public static` member

- The `private` constructor ensures that no calls will be allowed from outside the class. 
- The `private` constructor can be further protected by throwing an exception if a second instance is requested.
- The `public` member in this way can be either a static field or static method.
	- `public` feild approach is preferable over `public` factory method.
	- `public` factory method approach can be more flexible e.g. by allowing the return of an instance for each thread if necessary. 

- 1.1 **pubic field**

```java
public class Universe {

	public static final Universe INSTANCE = new Universe();
	private long timestamp;

	private Universe() {
		timestamp =  System.currentTimeMillis();
	}
	
}
```

- 1.2 **public static factory method**

```java
public class Universe {

	private static final Universe INSTANCE = new Universe();
	private long timestamp;

	private Universe() {
		timestamp =  System.currentTimeMillis();
	}
	
	public static Universe getInstance() {
		return INSTANCE;
	}
}
```

###  _Dealing with serialization_

- Maintaining singleton is not guaranteed for classes implementing _`Serializable`_.
- New instances will be created when serialized instances are deserialized. 

```java
public class Universe implements Serializable  {

	public static final Universe INSTANCE = new Universe();
	private long timestamp;
	
	private Universe() {
		timestamp =  System.currentTimeMillis();
	}
}
```

```java
public class App {
	public static void main(String[] args) throws Exception {
		
		Universe universe = Universe.INSTANCE;
				
		// serialize and deserialize
		Serializer.serialize(universe);
		Universe deserilizedUniverse = Serializer.deserialize();

		System.out.println(deserilizedUniverse == universe); // --> false
	}
}
```

```java
class Serializer{
	
	public static void serialize(Universe universe) throws Exception {
	    FileOutputStream file = new FileOutputStream("output.txt");
	    ObjectOutputStream out = new ObjectOutputStream(file);
	    out.writeObject(universe);
	    out.close();
	    file.close();
	}
	
	public static Universe deserialize() throws Exception {
	    FileInputStream file = new FileInputStream("output.txt");
	    ObjectInputStream in = new ObjectInputStream(file);
	    Universe universe = (Universe) in.readObject();
	    in.close();
	    file.close();
	    return universe;
	}
}
```

- To overcome this issue we need to add the following 
	- Declare all instance feilds `transient`
	- Implement **readResolve()** method

```java
public class Universe implements Serializable  {

	public static final Universe INSTANCE = new Universe();
	private transient long timestamp;
	
	private Universe() {
		timestamp =  System.currentTimeMillis();
	}

	private Object readResolve() {
		return INSTANCE;
	}
}
```

```java
System.out.println(deserilizedUniverse == universe); // --> true
```

### 2. Single Element `enum`

- Single-element `enum` is similar to public field approach.
- Single-element `enum` is thread, serialization and reflection safe approach. 

> "..a single-element enum type is often the best way to implement a singleton." ~ Joshua Block's, Effective Java

```java
public enum Universe {

	INSTANCE(System.currentTimeMillis());
	private long timestamp;

	private Universe(long timestamp) {
		this.timestamp = timestamp;
	}

	public long getTimestamp() {
		return timestamp;
	}
}
```

```java
public class App {

	public static void main(String[] args) throws Exception {
		
		System.out.println(Universe.INSTANCE.getTimestamp());
	}
}
```