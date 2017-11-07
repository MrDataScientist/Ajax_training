var generator_func = function* (){
   yield 1;
   yield 2;
};

var itr = generator_func();
console.log(itr.next());
console.log(itr.next());
console.log(itr.next());
