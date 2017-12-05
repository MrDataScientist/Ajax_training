import web3 from 'web3';
const web3 = new web3(new web3.providers.HttpProvider("https://localhost:8545"));
let greeterABI = [{}];
let greeterAddress = '';
const greeterContract = web3.eth.contract(greeterABI).at(greeterAddress);

export(greeterContract);
