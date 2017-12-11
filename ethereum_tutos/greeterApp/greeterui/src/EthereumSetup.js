/*import web3 from 'web3';
const web3 = new web3(new web3.providers.HttpProvider("https://localhost:8545"));
let greeterABI ='[{"constant": true,"inputs": [],"name": "greet","outputs": [{"name": "","type": "string"}],"payable": false,"type": "function"},{"constant": false,"inputs": [{"name": "_greeting","type": "string"}],"name": "greeter","outputs": [],"payable": false,"type": "function"}]';
let greeterAddress = '0xcc7c4f17302023dc8e05be04d6d7d9095d3bd18f';
const greeterContract = web3.eth.contract(greeterABI).at(greeterAddress);
//const greeterContract = new web3.eth.Contract([greeterABI],greeterAddress);
*/


//import web3 from 'web3';

const web3 = new web3.providers.HttpProvider("https://localhost:8545");
//web3.eth.defaultAccount = web3.eth.accounts[0];
//console.log(web3.eth.accounts[0]);
// Contract ABI from remix solidity
var CoursetroContract = web3.eth.contract('[{"constant": true,"inputs": [],"name": "greet","outputs": [{"name": "","type": "string"}],"payable": false,"type": "function"},{"constant": false,"inputs": [{"name": "_greeting","type": "string"}],"name": "greeter","outputs": [],"payable": false,"type": "function"}]');

var greeterContract = CoursetroContract.at('0xcc7c4f17302023dc8e05be04d6d7d9095d3bd18f');

export{greeterContract};
