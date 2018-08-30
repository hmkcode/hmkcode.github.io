---
layout: post
title:  "Algorithms for Finding all Possible Combinations of k Elements in an Array with Java Implementation"
date:   2018-08-30 10:00:00
categories: 
description: "Given an array of size N, we will find all possible combinations of k elements in that array using three different algorithms."
---

<p style="text-align: justify;">
	
	<a href="http://hmkcode.github.io/images/java/thumbnail_combinations_shifting.png">
		<img 
			class="size-full wp-image-315 aligncenter" 
			src="http://hmkcode.github.io/images/java/thumbnail_combinations_shifting.png" 
			alt="java-servlet-json" />
	</a>
	
	Given an array of size N e.g. `e={'A','B','C','D','E'}` **N=5**, we want to find all possible combinations of K elements in that array. For example, if K=3 then one possible combination is of array **e** is `{'A','B','C'}. Here we have three different algorithms for finding *k*-combinations of an array. 
	
</p>




## Forward-Backward Algorithm

Here we have two arrays and two main indices **r** & **i**:
- Array **e** which is the elements array.
- Array **pointers** which is an array for holding indices for selected element. 
- Index **i** for pointing to current selected element in array **e**.
- Index **r** for pointing to current position in **pointers** array.
- The algorithm will move forward by incrementing **i** & **r** as long as they do not exceed arrays length.
- If **r** reaches the last position of **pointers** array a combination is printed.
- If both indices reach the last poisition of their pointing arrays the algorith will step backward by reducing **r** value `r--` and set **i** with the value of `i = pointer[r]+1`.


![combinations_forwardbackward]({{ "http://hmkcode.github.io/images/java/combinations_forwardbackward.png" | absolute_url }})

```java
public static void combination(Object[]  elements, int K){

	// get the length of the array
	// e.g. for {'A','B','C','D'} => N = 4 
	int N = elements.length;
	
	if(K > N){
		System.out.println("Invalid input, K > N");
		return;
	}
	
	// calculate the possible combinations
	c(N,K);
	
	// init combination index array
	int pointers[] = new int[K];
	

	int r = 0; // index for combination array
	int i = 0; // index for elements array
	
	while(r >= 0){
	
		// forward step if i < (N + (r-K))
		if(i <= (N + (r - K))){
			pointers[r] = i;
				
			// if combination array is full print and increment i;
			if(r == K-1){
				print(pointers, elements);
				i++;				
			}
			else{
				// if combination is not full yet, select next element
				i = pointers[r]+1;
				r++;										
			}				
		}
		
		// backward step
		else{
			r--;
			if(r >= 0)
				i = pointers[r]+1;				
		}			
	}
}
```

## Shifting Algorithm

- This algorithm is move intuitive than the first one.
- We virtually split the elements array into two types of elements, K elements that can be selected and N-K elements that will be ignored. 
- After each iteration we shift the positions of ingnored elements as shown in the image below. 

![combinations_shifting]({{ "http://hmkcode.github.io/images/java/combinations_shifting.png" | absolute_url }})



```java
public static void combination(Object[]  e, int K){

	int[] ignore = new int[e.length-K]; // --> [0][0]
	int[] combination = new int[K]; // --> [][][]
	
	for(int w = 0; w < ignore.length; w++){ // --> [3][4]
		ignore[w] = e.length - K +(w+1);
		//System.out.println(ignore[w]);
	}
	
	int i = 0;
	int r = 0;
	int g = 0;
	boolean terminate = false;
	while(!terminate){    		
    	while(i < e.length && r < K){
    			
    		if(i != ignore[g]){
    			combination[r] = i;
    			System.out.print(e[combination[r]]+" ");
    			r++;
    			i++;
    		}
    		else{
    			g++;
    			
    			if(g == ignore.length)
    				g--;
    			
    			i++;
    		}
    	}
    	i = 0; r=0; g =0;
		System.out.println("");

    	terminate = true;
    	
    	for(int w = 0 ; w < ignore.length; w++){
    		if(ignore[w] > w){	    			
    			ignore[w]--;
    			
    			if(w > 0)
    				ignore[w-1] = ignore[w]-1;
    			terminate = false;
    			break;	    			
    		}
    	}
	}    		
}
```

## Recursive Algorithm

- Recursion is the simplest to implement but a little harder to visuallize.
- It works as shown below

![combinations_recursive]({{ "http://hmkcode.github.io/images/java/combinations_recursive.png" | absolute_url }})

```java
public static void combination(List<String> e, int K, String c){
	
	if(e.size() < K)
		return;
			
	if(K == 1)
		for(String s:e)
			print(c+s);
	else if(e.size() == K){
		for(String s:e)
			c+=s;
		print(c);
	}
	else if(e.size() > K)
		for(int i = 0 ; i < e.size() ; i++)
			combination(e.subList(i+1, e.size()), K-1, c+e.get(i));
		
}
```

### Source Code @ [GitHub](https://github.com/hmkcode/Java/blob/master/java-combinations)
