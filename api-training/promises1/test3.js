//stupid thing to do
function ff1(array) {
  //your code here
 var test=['Kevin', 'Bacon', 'Love', 'Hart', 'Costner', 'Spacey'];
  console.log(test[0]+"_"+test[5]);
}
ff1();

// this is how you should think and do
function transformFirstAndLast(array) {

  var myObject = {};
    myObject[array[0]] = array[array.length-1];
    return myObject;
}

  var arrayList = ['Queen', 'Elizabeth', 'Of Hearts', 'Beyonce'];
  var arrayList2 = ['Kevin', 'Bacon', 'Love', 'Hart', 'Costner', 'Spacey']

  console.log(transformFirstAndLast(arrayList));
  console.log(transformFirstAndLast(arrayList2));
