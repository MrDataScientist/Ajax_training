// this is an example about how to use promises

var isMmomHappy = true;
//promise
var willIGetNewPhone = new Promise(
  function (resolve,reject){
    if(isMmomHappy){
      var phone = {
        brand:"samsung",
        color:"black"
      };
      resolve(phone);
    } else {
      var reason = new Error('mom is not happy');
      reject(reason);
    }
  }
);
// call our promise
var askMom = function(){
  willIGetNewPhone
  .then(function(fulfilled){
    //yay you got a new phone
    console.log(fulfilled);
  })
  catch.(function(error){
    //ops, mom dont buy it
    console.log(error.message);
  });
}
askMom();
