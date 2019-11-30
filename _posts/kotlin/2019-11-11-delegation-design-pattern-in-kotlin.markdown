---
layout: post
title:  "Kotlin | Delegation Design Pattern"
date:   2019-11-11 12:00:00
categories: kotlin
description: Inheritance is a common solution for code reusability. Extending class implementation will allow subclasses to inherit implemented members e.g. functions and properties. Delegation design pattern, however, is an alternative solution to inheritance. Delegation pattern uses object composition to achieve code reusability. Kotlin provides native support for this pattern where a class can delegate implementation to a specified object. In this post we will explain delegation design pattern and see it in action usign Kotlin.
---


<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/kotlin/mode-delegation-design-pattern-uml.png">
		<img class="size-full wp-image-315 aligncenter" src="http://hmkcode.github.io/images/kotlin/mode-delegation-design-pattern-uml.png" 
		alt="mode-delegation-design-pattern-uml" />
	</a>
	
	Inheritance is a common solution for code reusability. Extending class implementation will allow subclasses to inherit implemented members e.g. functions and properties. Delegation design pattern, however, is an alternative solution to inheritance. Delegation pattern uses object composition to achieve code reusability. Kotlin provides native support for this pattern where a class can delegate implementation to a specified object. In this post we will explain delegation design pattern and see it in action usign Kotlin
</p>


## Overview

- We have an interface `Mode` which has one function `display()` and one String property `color:String`.
- We initially have two classes implementing `Mode` interface namely `DarkMode` and `LightMode`. 


![mode-initial-architecture]({{ "http://hmkcode.github.io/images/kotlin/mode-initial-architecture.png" | absolute_url }})


```java
interface Mode{
    val color:String
    fun display()
}

class DarkMode(override val color:String) : Mode{    
    override fun display(){
        println("Displayig dark mode...")
    }
}
class LightMode(override val color:String) : Mode {
    override fun display() { 
        println("Displayig light mode...") 
    }
}
```
- **We wanted to derive a custom mode from each implemented mode. Each custom mode reuse `display()` function from its parent mode.**
- We can achieve this goal using one of the following solutions:
	- Extending initially implemented modes using **inheritance**.
	- Delegating implementation using delegation pattern.


## 1 | Extending Modes Using Inheritance

- If we want to extend existing dark and light modes, the trivial solution is inheritance.
- Inheritance allow subclasses to reuse the implementation from the extended classes `DarkMode` & `LightMode`.
- So, we will create two new subclasses `MyCustomDarkMode` & `MyCustomLightMode` each extending one of the implemented modes.

![mode-inheritance-uml]({{ "http://hmkcode.github.io/images/kotlin/mode-inheritance-uml.png" | absolute_url }})

```java
interface Mode{
    val color:String
    fun display()
}

open class DarkMode(override val color:String) : Mode{    
    override fun display(){
        println("Dark Mode..."+color)
    }
}
open class LightMode(override val color:String) : Mode {
    override fun display() { 
        println("Light Mode..."+color) 
    }
}

class MyCustomDarkMode(override val color:String): DarkMode(color)
class MyCustomLightMode(override val color:String): LightMode(color)
```

```java
fun main() {
    MyCustomDarkMode("CUSTOM_DARK_BLUE").display()
}
```
- Now, each new custom mode can reuse the implementation of its parent mode.
- However, notice that in Kotlin parent modes should be `open class` in order to be extendable. 
- Also, a drawback of inheritance is that we need to create a separate custom mode for each parent mode. 


## 2 | Using Delegation Pattern
> *"[Delegation pattern](https://en.wikipedia.org/wiki/Delegation_pattern) is an object-oriented design pattern that allows object composition to achieve the same code reuse as inheritance."*

- Using delegation, we can achieve code reusability using object composition.
- We can create *one* custom mode that reuses `display()` function of each initial mode.
- The custom mode class will implement the interface `Mode` as well as taking a parameter of type `Mode` in its constructor.

![mode-delegation-design-pattern-uml.png]({{ "http://hmkcode.github.io/images/kotlin/mode-delegation-design-pattern-uml.png" | absolute_url }})

```java
interface Mode{
    val color:String
    fun display()
}

class DarkMode(override val color:String) : Mode{    
    override fun display(){
        println("Dark Mode..."+color)
    }
}
class LightMode(override val color:String) : Mode {
    override fun display() { 
        println("Light Mode..."+color) 
    }
}

class MyCustomMode(val mode: Mode): Mode{
    override val color:String = mode.color
    override fun display() { 
        mode.display()
    }
}
```

- Now, the custom mode can reuse `display()` function of both modes `DarkMode` & `LightMode`.

```java
fun main() {
    MyCustomMode(DarkMode("CUSTOM_DARK_GRAY")).display()
    MyCustomMode(LightMode("CUSTOM_LIGHT_GRAY")).display()
}

/* output:
Dark Mode...CUSTOM_DARK_GRAY
Light Mode...CUSTOM_LIGHT_GRAY
*/
```

### Kotlin Native Support for Delegation Pattern

- Kotlin natively support delegation pattern.
- Kotlin provides `by` keyword to specify the **delegate** object which our custom mode will be delegating to. 
- We can achieve the same result of the code above using `by` keyword.

```java
class MyCustomMode(val mode: Mode): Mode by mode
```

```java
fun main() {
    MyCustomMode(DarkMode("CUSTOM_DARK_GRAY")).display()
    MyCustomMode(LightMode("CUSTOM_LIGHT_GRAY")).display()
}

/* output:
Dark Mode...CUSTOM_DARK_GRAY
Light Mode...CUSTOM_LIGHT_GRAY
*/
```





