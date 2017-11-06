var hello = function *(name){
  yield 'your name is ' +name;
  return  'hello '+name;
}

var gen = hello('james');

console.log(gen.next());
console.log(gen.next());
