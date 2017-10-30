/*Usage:
@autor Tarik
- Use this file to ethereum_example1.js
- Run testRPC
- Run this script, type: node ethereum_example1.js
*/

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Information about web3 api:
// https://github.com/ethereum/wiki/wiki/JavaScript-API

function showAccounts() {
  web3.eth.getAccounts((err, accounts) => {
    if (err != null) {
      console.log("There was an error fetching your accounts.");
      return;
    }

    if (accounts.length == 0) {
      console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }
    callback(accounts);
  });
}

function callback(accounts){
  for(var i=0; i<accounts.length; i++) {
    console.log(accounts[i]);
  }
}

console.log("Show all accounts on your running ethereum node");
console.log("\n");
showAccounts();
