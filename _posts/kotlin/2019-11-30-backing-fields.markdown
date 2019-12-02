---
layout: post
title:  "Kotlin | Backing Fields"
date:   2019-11-30 12:00:00
categories: kotlin
description: Kotlin auto-generates a field referencing a class property within its accessors "get() or set()". This field is called a backing field and it will be generated if a property uses the default accessors implementation or if one of the accessors references it through field identifier
---
 

<p style="text-align: justify;">
	
	<a href="https://hmkcode.com/images/kotlin/kotlin-backing-fields.png">
		<img class="size-full wp-image-315 aligncenter" src="https://hmkcode.com/images/kotlin/kotlin-backing-fields.png" 
		alt="mode-delegation-design-pattern-uml" />
	</a>
	
	Kotlin auto-generates a field referencing a class property within its accessors "get() or set()". This field is called a backing field and it will be generated if a property uses the default accessors implementation or if one of the accessors references it through <code>field</code> identifier.
</p>


## **Class Properties**

- `val` & `var` variables defined within the body of a class are called **calss properties**.

```java
class SomeClass{
    val id:Int = 2  // property "id" of type Int
    var name:String = "" // property "name" of type String
}
```

- **Class properties** are accessible using properties names and dot notation on instances of the class.
- Properties declared as `val` are read-only i.e. have **get()**.
- Properties declared as `var` are mutable i.e. have **get()** and **set()**.

```java
val someClass:SomeClass = SomeClass() // create an instance of class SomeClass
println(someClass.id) // getting value of id = 2
someClass.name = "SomeName" // setting value of name
println(someClass.name) // SomeName // getting value of name

```

- **So, where are those `get()` and `set()` defined?**

## **Auto-Generated `get()` & `set()`**

- Kotlin, implicitly generates accessors function i.e. `get()` & `set()` with **default implementation** for declared properties.
- The default implementation of `get()` returns property value, while default implementation of `set(value)` assigns the passed `value` to the property.
- `get()` & `set()` can be explicitly defined as shown below.

```java
class SomeClass{
    val id:Int = 2  // property "id" of type Int
        get():Int { ... }

    var name:String = "" // property "name" of type String
        get():String { ... }
        set(value):Unit { ... }
}
```

- **So, how does `get()` return the property value?**

## **This will generate `StackOverflowError`!**

- We may think that, `get()` returns the value of a property by simply using the property name e.g. `get(){ return id }`.
- Actually, this implementation will generate a `StackOverflowError` because we are making a recursive call to to the property.

```java
class SomeClass{
    val id:Int = 2  // property "id" of type Int
        get():Int { return id } // recursive call StackOverflowError

    var name:String = "" // property "name" of type String
        get():String { return name } // recursive call StackOverflowError
        set(value):Unit { name = value } // recursive call StackOverflowError
}
```

- **So, how do `get()` & `set()` refer to a property?**

## **Backing `field`**

- To avoid recursive call, Kotlin provides a backing `field` that will help you refer to a property within its `get()` & `set()` functions.
- `field` identifier can only be used in the accessors of the property.


```java
class SomeClass{
    val id:Int = 2  // property "id" of type Int
        get():Int = field // default implementation

    var name:String = "" // property "name" of type String
        get():String = field  // default implementation
        set(value):Unit { field = value }  // default implementation
}
```

- Kotlin provides a backing `field` automatically if it is used in the accessors i.e. if we override the default implementation of the accessors with a custom implementation that does not use backing `field` kotlin will NOT generate it.

```java
val text:String = "ABCDEF"
val isEmpty: Boolean
get() = text.length == 0 // there will be no backing field
```

## **Properties without Backing Fields**

- Backing fields are not available for properties in the following cases:
    1. Properties declared in interfaces.
    2. Properties annotated with `inline` modifier.
    3. Extension properties


```java
// 1. interface property
interface SomeInterface{
    var ID:Int 
    	get() = 3 // field is not allowed for inteface property
    	set(value){ } // field is not allowed for inteface property
    	
}

// 2. inline property
class SomeClass{
    inline var id:Int
    	get() = 3 // field is not allowed for inline property
    	set(value){ } // field is not allowed for inline property
}

// 3. extension property
val SomeClass.name:String
	get() = "SomeName" // field is not allowed for extension property
```    






