import web3 from 'web3';
const web3 = new web3(new web3.providers.HttpProvider("https://localhost:8545"));
let greeterABI = [{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
let greeterAddress = '0x6c03157c4880f42bf7bcf54b289bd4d59fe9279f';
const greeterContract = web3.eth.contract(greeterABI).at(greeterAddress);
export(greeterContract);
