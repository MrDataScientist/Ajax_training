//-----------------------------------------------------------------------
//ACESSING ARRAY ELEMENTS
//-----------------------------------------------------------------------
//Skipped 1 & 2

// 3. Write a function `last` that takes an array as an argument and returns the
//   *last* element in the array. **Hint:** What is the relationship between the
//   *index* of the last element in the array and the *length* of the array?

//Solution 

// function last(array) {
//   var final = array[array.length - 1]
//   return final
// }

// last([1, 2, 3]);

//-----------------------------------------------------------------------
//MODIFYING ARRAYS
//-----------------------------------------------------------------------

// 1. Using `push` and `unshift`, make this array contain the
//   numbers from zero through seven:

//   ```js
//   var arr = [2, 3, 4];
//   // your code here
//   arr; // => [0, 1, 2, 3, 4, 5, 6, 7]
//   ```
   
//Solution
/*
 var array = [2, 3, 4];
 array.unshift(0, 1); // unshift add new elements to an array
 array.push(5, 6, 7, 8);
 console.log(array);
*/
//-----------------------------------------------------------------------

// 2. What is *returned* by `push`? Before throwing this into the console, form a
//   hypothesis about what you think the return value will be:

//   ```js
/*
  var arr = [5, 7, 9];
  arr.unshift(88,66);
   arr.push(6); // 5,7,9,6
   console.log(arr);
*/
//   Were you correct? What is the returned by `push`? Does `unshift` work in the
//   same way?

// I think .push() will return the entire array.
// test
/*
var array = [5, 7, 9];
 array.push(6);
 array.unshift(1);
 console.log(array);
*/
// both return "4". 
// returns the NUMBER OF ELEMENTS in the array. 

//-----------------------------------------------------------------------

// 3. We can use the *assignment operator* (`=`) to replace elements in arrays with
//   other ones like so:

//   ```js
  // var animals = ['dog', 'elephant', 'zebra']
   // let's replace 'dog' with 'hippo'
  // animals[0] = 'hippo';
  // animals; // => ['hippo', 'elephant', 'zebra']
  // ```

  // Using the same principle, perform the following:

  // ```js
   // 1. Change all odd numbers to be those numbers multiplied by two:
  // var numbers = [4, 9, 7, 2, 1, 8];
  // // TODO: your code here
  // numbers; // => [4, 18, 14, 2, 2, 8]

  // // 2. Fix the typos by replacing each element with a correctly spelled version
  // var places = ['snfranisco', 'oacklannd', 'santacrus']
  // // TODO: your code here
  // places; // => ['san francisco', 'oakland', 'santa cruz']
  // ```

//Solution

// function oddMultiplication(array) {
//   for (i = 0; i < array.length; i++) {
//     if (array[i] % 2 !== 0) {
//       array[i] = array[i] * 2; 
//     }
//   }
//   return array
// }

// oddMultiplication([1, 2, 3, 4, 5])

//-----------------------------------------------------------------------
//MORE PRACTICE
//-----------------------------------------------------------------------
// 1. Write a function called `nth` that accepts an array and an index as
//   parameters, and returns the element at that index.

//   ```js
//   function nth(array, index) {
//     // TODO: your code here
//   }
//   var animals = ['dog', 'cat', 'gerbil'];
//   nth(animals, 2); // => 'gerbil'
//   nth(animals, 1) === animals[1]; // => true
//   ```

//Solution

// function nth(array, index) {
//   return array[index];
// }

// nth([1, "hello", 3, 4], 1);

//-----------------------------------------------------------------------
// 2. Write a function `rest` that returns all the elements in the array *except*
//   for the first one. **HINT:** Read about the `slice` method on
//   [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
//   and/or experiment with `slice` at the console like so:

//   ```js
  // var numbers = [3, 2, 7, 5];
  // console.log(numbers.slice(0));
  // console.log(numbers.slice(1));
  // console.log(numbers.slice(2));
  // console.log(numbers.slice(0, 2));
//   ```

//Solution 
/*
function rest(array) {
  return array.slice(1);
}
*/
// rest(["This", 'is', 'my', 'array']);

//-----------------------------------------------------------------------
// 3. Write a function `butlast` that returns all of the elements in the array
//   *except* for the last one (you may want to use `slice` for this one as well).

//Solution without "slice"

// function butLast(array) {
//   finalArray = [];
//   for (i=0; i < (array.length - 1); i++) {
//     finalArray.push(array[i]);
//   }
//   return finalArray;
// }

// butLast([1, 2, 3, 4, 5, "Don't show"]);

//Solution with slice

// function butLast(array) {
//   var lastElement = (array.length - 1);
//   array = array.slice(0, lastElement);
//   return array;
// }

// butLast([1, 2, 3, 4, 5]);

//-----------------------------------------------------------------------
// 4. Complete the function `cons` that accepts an element and an array, and
//   returns an array with the element added to the *front* of the array:

//   ```js
//   function cons(x, array) {
//     // your code here
//   }
//   ```

//Solution 

// function cons(x, array) {
//   array.unshift(x); 
//   return array;
// }

// cons("add me", ['if', 'you', 'dare']);

//-----------------------------------------------------------------------
// 5. Complete the function `conj` that accepts an array and an element, and
//   returns an array with the element added to the *end* of the array:

//   ```js
//   function conj(array, x) {
//     // your code here
//   }
//   ```

//Solution 
/*
function conj(array, x) {
  array.push(x);
  return array;
}
/*
// conj(['this', 'is', 'easy', 'practice'], "!");

//-----------------------------------------------------------------------
// 1. Without running the below function, use a whiteboard to figure out what it
//   should return by repeatedly expanding function invocations:

//   ```js
//   function mystery(array) {
//     if (array.length === 0) {
//       return [];
//     }
//     return conj(mystery(rest(array)), first(array));
//   }
  // ```
   
// rest(array) returns all the elements in an array EXCEPT for the first.
// first(array) returns the first element in an array.
// conj(array, x) returns the array with element x added as the last element.


// function first(array) {
//   return array[0];
// }


// function mystery(array) {
//   if (array.length === 0) {
//     return [];
//   }
//   return conj(mystery(rest(array)), first(array));
// }

// mystery([1, 2, 3, 4, 5]);

// reverses the order of the elements in the array.

//-----------------------------------------------------------------------



// YOU'RE NOT WORTH MY TIME  8=D~~~~~ ACTUAL SIZE
/*
2. Using `first`, `rest`, `conj` and/or `cons`, write functions that accomplish
   the following:

   + `sum` all the elements of an array
   + Given an array, returns a new array with each element *squared*
   + Given an array of numbers, returns a new array of just the *even* numbers

   **HINT:** After figuring out how the `mystery` function works above, use it
   as a reference for how to write this type of function.

function sum(array) {
  var count = 0;
  if (count < array.length) {
    var result = sum(array); 
  }
}
*/


// array = [0, 1, 2, 3];

// array.reduce(function(prev, curr) {
//   return prev + curr;
// }, 0);
//6

//[].map(function(x) {
//  return x * 2
//  });
// each element in the array will be multiplied by 2 

//[].filter(function(word){
//  return word.length > 6;
//  });
// returns words with more than 6 characters. 

// arrow method
// [1, 2, 3, 4].map(val => val * 2);

//rest parameters
// function logThem(...params) {
//   console.log(params);
// }

// logThem("hello", "my", "friends")
