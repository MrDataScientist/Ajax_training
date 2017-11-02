/* ES5, using Bluebird */

var isMomHappy = true;
//Promise
var willIGetNewPhone = new Promise(
  function (resolve,reject){
    if(isMomHappy){
      var phone = {
        brand:"samsung",
        color:"black"
      };
      resolve(phone);
    } else {
      var reason = new Error('mom is not happy');
      reject(reason);

  }
);
// here we call our promise
// call our promise
var askMom = function(){
  willIGetNewPhone
  .then(function (fulfilled){
    //yay you got a new phone
    console.log(fulfilled);
  })
  catch.(function(error){
    // ops mom dont buy phone
    console.log(error.message);
  });
}

askMom();
