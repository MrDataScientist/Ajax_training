Promise.resolve(1)
    .then(() => {
    return Promise.resolve(2);
   // when we arrive to this line, const hi = Promise.resolve(2) promise starts execution.
   // when :hi is resolved, all thens, that are attached to it, - get fired.
   // in our case, only the next :then is attached.
   // If :hi got rejected, the closest :catch would get fired.
}).then((value) => {
    console.log(value) //=> 2
    return Promise.reject(3)
}).then(() => {
    // is never executed
}).catch((value) => {
    console.log(value) //=> 3
    return Promise.reject(4)
}).catch((value) => {
    console.log(value) //=> 4
    return 5 // same as Promise.resolve(5)
}).then((value) => {
    console.log(value) //=> 5
    // notice we returned nothing. same as Promise.resolve(undefined)
}).then((value) => {
    console.log(value) //=> undefined
});
