---
layout: post
title:  "Java | Nested Classes"
date:   2022-07-07 12:00:00
categories: java
description: Nested class is a class that is defined within another class. This post explains different types of nested classes. 
---


![java-nested-class.png]({{ "/images/java/java-nested-class.png" }})


- Nested class is a class that is defined within another class. 

```java
public class OuterClass {
    
    class NestedClass {

    }
}
```

- A nested class is a member of its enclosing class.
- Nested class should only serve its enclosing class. If a nested class is needed outside the context of its enclosing class then it should be defined as a top-level class.
- There are four kinds of nested classes:
    - static member classes
    - non-static member classes
    - anonymous classes
    - local classes

### Non-Static Nested Classes "Inner Classes"

- Non-static nested classes are called inner classes. 
- Inner class is associated with an instance of its enclosing class
- Inner class has access to members of its enclosing class, even if they are declared private.

```java
public class OuterClass {
    
    private String name = "OuterClass.name";
	private static String NAME = "OuterClass.NAME";

    public class InnerClass {
        public InnerClass(){
            // InnerClass can access non-static "name" and static "NAME" members of OuterClass
    		System.out.println("InnerClass "+name+" "+NAME);
        }
    }
}

public class App {

	public static void main(String[] args) {
		
        // InnerClass is associated with an instance of OuterClass
		OuterClass.InnerClass innerClass = new OuterClass().new InnerClass();	
	}
}
```

**Output:**

```
InnerClass OuterClass.name
```

### Static Nested Classes

- Static nested class is associated with its outer class
- Static nested classes do not have access to other members of the enclosing class. 
- Nested class that does not require access to an enclosing instance should be declared `static`.
- A nested class can be declared `private`, `public`, `protected`, or package private. (OuterClass can only be declared public or package private.)

```java
public class OuterClass {
    
    private String name = "OuterClass.name";
	private static String NAME = "OuterClass.NAME";

    static class StaticNestedClass {

        public StaticNestedClass(){
            
            // StaticNestedClass can only access static member "NAME" of OuterClass
    		System.out.println("StaticNestedClass "+NAME);
    	}
    }
}

public class App {

	public static void main(String[] args) {
		
		OuterClass.StaticNestedClass staticNestedClass = new OuterClass.StaticNestedClass();	
	}
}
```

**Output:**

```
StaticNestedClass OuterClass.NAME
```

### Anonymous Classes

- Anonymous class has no name and is not a member of its enclosing class.
- Anonymous class is declared and instantiated at the same time.
- Anonymous class is commonly used to implement an interface with few methods.

```java
interface SomeInterface {
	
	void doSomething();
}

public class App {

	public static void main(String[] args) {
				
		String name = "App class";

		someMethod(new SomeInterface() {
			@Override
			public void doSomething() {
				System.out.println("Anonymous class inside "+name);
			}			
		});
	}
	
	public static void someMethod(SomeInterface someInterface) {
		someInterface.doSomething();
	}
}
```

- **lambda** expression can be used instead of an anonymous class expression if the interface contains only one method.

```java
public class App {

	public static void main(String[] args) {
				
		String name = "App class";

		SomeInterface lambda = () -> { System.out.println("Anonymous class inside "+name); };
		someMethod(lambda);
	}
	
	public static void someMethod(SomeInterface someInterface) {
		someInterface.doSomething();
	}
}
```