function transformFirstAndLast(array) {

  var myObject = {};
    myObject[array[0]] = array[array.length-1];
    return myObject;
}

  var arrayList = ['Queen', 'Elizabeth', 'Of Hearts', 'Beyonce'];
  var arrayList2 = ['Kevin', 'Bacon', 'Love', 'Hart', 'Costner', 'Spacey']

  console.log(transformFirstAndLast(arrayList));
  console.log(transformFirstAndLast(arrayList2));
