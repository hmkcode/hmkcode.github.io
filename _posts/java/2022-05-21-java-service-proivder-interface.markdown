---
layout: post
title:  "Java | Service Provider Interface"
date:   2022-05-20 12:00:00
categories: java
description: Service provider interface (SPI) enables developers to extend applications functionalities by adding services implementation, e.g. Jar files, to classpath without modifying the application code base.
---


![service-provider-interface.png]({{ "/images/java/service-provider-interface.png" }})

Service provider interface (SPI) enables developers to extend applications functionalities by adding services implementation, e.g. Jar files, to classpath without modifying the application code base.

## Service Provider Interface Components

- **Service:**
Classes on interfaces that provide access to functionality of feature.

```java
public interface MyService {

	void doSomething();
}
```

- **Service Provider Interface (SPI):** interfaces or abstract classes that define the set of services that can be provided to the application. 

```java
public interface MyServiceProviderInterface {

	MyService getService();
}
```

- **Service Provider:** implementation of the SPI that provide concrete implementation of the service.

```java
public class MyServiceImpl1 implements MyService{

	@Override
	public void doSomething() {
		System.out.println("MyServiceImpl1");
		
	}
}

public class MyServiceProviderImpl1 implements MyServiceProviderInterface {

	@Override
	public MyService getService() {
		return new MyServiceImpl1();
	}

}
```

## The ServiceLoader Class

The `java.util.ServiceLoader` class helps you find, load, and use service providers. Providers can be added to classpath or runtime extension directory. The application needs to specify the provider interface to the loader to find it and load it. 

```java
public class MyServiceLoader {

    private static final String DEFAULT_PROVIDER = "com.hmkcode.impl.MyServiceProviderImpl1";
    
    public static MyServiceProviderInterface defaultProvider() {
    	return provider(DEFAULT_PROVIDER);
    }
    
    public static MyServiceProviderInterface provider(String providerName) {
        ServiceLoader<MyServiceProviderInterface> loader = 
        		ServiceLoader.load(MyServiceProviderInterface.class);

        Iterator<MyServiceProviderInterface> it = loader.iterator();
        while (it.hasNext()) {
        	MyServiceProviderInterface provider = it.next();
            if (providerName.equals(provider.getClass().getName())) {
                return provider;
            }
        }
        throw new ProviderNotFoundException("provider " + providerName + " not found");
    }
    
}
```

## Example

We have three Java projects:

- **java-spi-api**: api project containing
	- `MyService.java` service interface
	- `MyServiceProviderInterface.java` SPI interface

```java
public interface MyService { 
	void doSomething(); 
}

public interface MyServiceProviderInterface { 
	MyService getService(); 
}
```

- **java-spi-impl1**: implementation of service provider 
	- `MyServiceImpl1.java`: service implementation i.e. implements `MyService.java`
	- `MyServiceProviderImpl1.java`: service provider implementation.
	- `com.hmkcode.api.MyServiceProviderInterface`: provider configuration file placed under **META-INF/services** directory.

```java
public class MyServiceImpl1 implements MyService{

	@Override
	public void doSomething() {
		System.out.println("MyServiceImpl1");	
	}
}

public class MyServiceProviderImpl1 implements MyServiceProviderInterface {
	
	@Override
	public MyService getService() {
		return new MyServiceImpl1();
	}
}
```
- **java-spi-app**: main application
	- `App.java`: main method
	- `MyServiceLoader.java`: service loader that helps find, load and use service providers.

```java
package com.hmkcode.app;

public class App 
{
    public static void main( String[] args )
    {        
        MyServiceLoader.defaultProvider().getService().doSomething();
    }
}
```

![spi-example.png]({{ "/images/java/spi-example.png" }})




### Source Code @ [GitHub](https://github.com/hmkcode/Java/tree/master/java-spi)
