---
layout: post
title:  "Kotlin | Function Type, Lambda and Higher-Order Functions"
date:   2019-12-15 12:00:00
categories: kotlin
description: Functions in Kotlin can be stored in variables, passed as arguments to other functions and returned from other functions. However, since Kotlin is statically typed language, functions should have a type. In this post we will see how to declare the type of a function, how to use lambda to define a function and how to define a higher order function.
---


![android-recyclerview-listadapter_files.png]({{ "/images/kotlin/kotlin-function-type.png" 
| absolute_url }})

Functions in Kotlin can be stored in variables, passed as arguments to other functions and returned from other functions. However, since Kotlin is statically typed language, functions should have a type. In this post we will see how to declare the type of a function, how to use lambda to define a function and how to define a higher order function.


## **Function Type**

- We know that a variable can have an explicit declared type or an implicit inferred type.
- The declared or inferred type is the type of the assigned or returned value.


```java
val a:Int = 1 // explicit "Int" type
val b = "ABC"   // inferred "Int" type
val c = SomeClass() // inferred "SomeClass" type

fun sum(a:Int, b:Int) = a + b // inferred return type "Int"
```
- Most often, the declared or inferred type is a **class type**. 
- However, the declared or inferred type can also be a **function type** because ***in Kotlin, functions have types too!***
- Unlike class type, **function type** is defined by its signature i.e. parameters and return type.
- Special notation is used to define the type of a function based on its parameters and return types.
- A function type is defined by listing the types of the input parameters between parentheses followed by an arrow `->` and ended by the return type.
- For example, `(Int, Int) -> Boolean` is a function type representing all functions that take two arguments of type `Int` and return `Boolean`. 
- For example, the function below has a function type `(Int, Int) -> Boolean`.

```java
fun gt(a: Int, b: Int): Boolean = a > b // function type: (Int,Int) -> Boolean
```
- Function type with now parameters can be written as following `() -> A` where A is a return type.

```java
fun print(){ println("printing...") } // function type:  () -> Unit
```

- Function type can also specify receiver type e.g. `Int.(Int) -> Boolean` represents a function that is called on an receiver object of type `Int` , takes one parameter of type `Int` and returns `Boolean`

```java
fun Int.gt(b: Int): Boolean = this > b // function type Int.(Int) -> Boolean
```

- Now, the function type can be used to declare variable type, parameter type or return type.

```java
// variable with function type: (Int, Int) -> Boolean
val f: (Int, Int) -> Boolean = ...

// parameter with function type: (Int, Int)-> Int
fun someFunction(a:Int, f: (Int, Int) -> Int) { ... }

// return function of function type: () -> Unit
fun anotherFunction(): () -> Unit { ... }
```

### **`typealias`**

- To improve code readability, function type can be named using `typealias` keyword. 

```java
typealias someType = (Int, Int) -> Boolean

val f: someType = ... 
// this equavalent  val f: (Int, Int) -> Boolean =
```

## **Lambda**

- Lambda is a literal function which means it is not declared but passed as an expression.
- Lambda expression is always surrounded by curly braces `{...}`
- Parameters types are optional if they can be inferred.
- Lambda's body goes after the arrow `->`.
- Similar to regular function, lambda has a function type.

```java
{a:Int, b:Int -> a + b} // lambda of function type: (Int, Int) -> Int

// Equivalent function 
fun sum(a:Int , b:Int) = a + b 
```

- We can assign lambda to a variable of similar function type:

```java
var sum: (Int, Int) -> Int = {a:Int, b:Int -> a + b} 
```

- Which can be written without parameters types.

```java
val sum: (Int, Int) -> Int = {a , b -> a + b} 

println(sum(2,3)) // call sum
```

### **Special Case: Lambda with single parameter**

- Lambda with single parameter is a special case. 
- The single parameter can be omitted along with the arrow `->` and use `it` as a reference to the single parameter.

- Regular way:

```java
var increment: (Int) -> Int = { a -> a + 1 } 
```
- Special case, single parameter is referenced as `it`

```java
var increment: (Int) -> Int = { it + 1 } 
```

### **Where is `return` in lambda?**

- By default, the last expression of a lambda is implicitly returned.

```java
 val sum: (Int, Int) -> Int = {a , b -> 
        println("a = $a")
        println("b = $b")
        a + b // last expression is returned
    }
```

## **Anonymous Functions**

- Anonymous function is also a literal function which means it is not declared but passed as an expression.
- Anonymous function is a regular function without a name.
- Similar to regular functions, anonymous functions have function type.

```java
var sum: (Int, Int) -> Int = fun(x: Int, y: Int): Int = x + y

println(sum(2,3)) // call sum
```

## **Creating & Calling Instances of a Function Type**

- Similar to class type, we can create instances of a given function type.
- There are serval ways to create an instance of a function type.
- For example, to create instances of **`(Int, Int) -> Int`** we can use one of the following ways:

 - **Lambda** 

```java
val sum: (Int, Int) -> Int = {a , b -> a + b} 
```
- **Anonymous function**

```java
var sum: (Int, Int) -> Int = fun(x: Int, y: Int): Int = x + y
```
- **Callable Reference**

```java
fun sum(a: Int, b:Int) = a + b // top-level function

val sum: (Int, Int) -> Int = ::sum

class SomeClass{
fun sum(a: Int, b:Int) = a + b // member function
}

val sum: (Int, Int) -> Int = SomeClass()::sum
```
- **Implementing function type**

```java
class SumFunctionType: (Int, Int) -> Int {
override operator fun invoke(a: Int, b:Int) = a + b
} 

val sum: (Int, Int) -> Int = SumFunctionType()
```

### **Calling an instance of a function type**

- Instances of a function type created using one of the ways above can be invoked using `invoke(a, b, ...)` function.
- Or directly passing the parameter `(a, b, ...)`
- For receiver type, the receiver should be the first argument.

```java
val sum: (Int, Int) -> Int = {a , b -> a + b} 

sum(2,3) // 5
sum.invoke(2,3) // 5

{a:Int, b:Int -> a + b}.invoke(2,3) // 5
{a:Int, b:Int -> a > b}(2,3) // 5

val f: Int.(Int) -> Int = { b -> this + b}
f.invoke(2,3) //5
f(2,3) // 5
2.f(3) //5
```     

### **| Higher-Order Functions**

- Higher-order functions can take functions as parameters or return a function.
- The type of the parameter accepting the function or the return type is declared using **function type**.


```java
//  Higher-Order Function
fun higherOrderSum(a:Int, b:Int, f: (Int, Int) -> Int): Int{
    return f(a,b)
}
```
```java
typealias someType = (Int, Int) -> Int

fun main() { 	
    val lambdaSum: someType = {a , b -> a + b}     
	println(higherOrderSum(2, 3, lambdaSum)) // 5
}
```







