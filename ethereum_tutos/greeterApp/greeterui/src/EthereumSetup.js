import web3 from 'web3';
//const web3 = new web3(new web3.providers.HttpProvider("https://localhost:8545"));
let greeterABI ='[{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_greeting","type":"string"}],"name":"greeter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
let greeterAddress = '0xcc7c4f17302023dc8e05be04d6d7d9095d3bd18f';
const greeterContract = web3.eth.contract(greeterABI).at(greeterAddress);
//const greeterContract = new web3.eth.Contract([greeterABI],greeterAddress);
export{greeterContract};
