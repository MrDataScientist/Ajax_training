/*
Write a function 'transformFirstAndLast' that takes in an array, and returns an object with:
1) the first element of the array as the object's key, and
2) the last element of the array as that key's value.
Example input:
['Queen', 'Elizabeth', 'Of Hearts', 'Beyonce']
Function's return value (output):
{
  Queen : 'Beyonce'
}
Do not change the input array. Assume all elements in the input array will be of type 'string'.
Note that the input array may have a varying number of elements. Your code should flexibly accommodate that.
E.g. it should handle input like:
['Kevin', 'Bacon', 'Love', 'Hart', 'Costner', 'Spacey']
Function's return value (output):
{
  Kevin : 'Spacey'
}
Starter Code
function transformFirstAndLast(array) {
  // your code here
}
*/

/*function transformFirstAndLast(array) {
  //your code here
 var test=['Kevin', 'Bacon', 'Love', 'Hart', 'Costner', 'Spacey'];
  console.log(test[0]+" "+ test[5]);
}
transformFirstAndLast();*/

function transformFirstAndLast(array) {

  var myObject = {};
    myObject[array[0]] = array[array.length-1];
    return myObject;
}

  var arrayList = ['Queen', 'Elizabeth', 'Of Hearts', 'Beyonce'];
  var arrayList2 = ['Kevin', 'Bacon', 'Love', 'Hart', 'Costner', 'Spacey']

  console.log(transformFirstAndLast(arrayList));
  console.log(transformFirstAndLast(arrayList2));
