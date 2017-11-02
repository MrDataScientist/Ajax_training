let Observable = Rx.Observable;
let resultA, resultB, resultC;

function addAsync(num1, num2) {
	// use ES6 fetch API, which return a promise
	const promise = Promise.resolve(num1 + num2);

    return Observable.fromPromise(promise);
}

addAsync(1,2)
  .do(x => resultA = x)
  .flatMap(x => addAsync(x, 3))
  .do(x => resultB = x)
  .flatMap(x => addAsync(x, 4))
  .do(x => resultC = x)
  .subscribe(x => {
    console.log('total: ' + x)
    console.log(resultA, resultB, resultC)
  });


/*
resultA 3
resultB 6
resultC 10
*/
