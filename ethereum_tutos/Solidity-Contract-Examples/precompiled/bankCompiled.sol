personal.unlockAccount("0xdc85a8429998bd4eef79307e556f70bb70d8caf1","bitcoin");
var cashoutContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"customer","type":"address"}],"name":"withdraw50","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"refund","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"customer","type":"address"}],"name":"withdraw20","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"customer","type":"address"}],"name":"withdraw100","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"customer","type":"address"}],"name":"getBalanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"customer","type":"address"}],"name":"withdraw5","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"mortal","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"customer","type":"address"}],"name":"deposit","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]);
var cashout = cashoutContract.new(
   {
     from: web3.eth.accounts[0],
     data: '606060405266b1a2bc2ec500006001600050556702c68af0bb1400006002600050556706f05b59d3b20000600360005055670de0b6b3a76400006004600050555b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600060023073ffffffffffffffffffffffffffffffffffffffff163104604051809050600060405180830381858888f19350505050505b6106eb806100be6000396000f360606040523615610095576000357c0100000000000000000000000000000000000000000000000000000000900480633218c33f14610097578063410085df146100af57806341c0e1b51461013c5780634a8419fd1461014b5780635344e3bd146101635780639b96eece1461017b578063a944554b146101a7578063f1eae25c146101bf578063f340fa01146101ce57610095565b005b6100ad60048080359060200190919050506101e6565b005b6100ce60048080359060200190919080359060200190919050506102a9565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610149600480505061035c565b005b61016160048080359060200190919050506103f0565b005b61017960048080359060200190919050506104b3565b005b6101916004808035906020019091905050610576565b6040518082815260200191505060405180910390f35b6101bd60048080359060200190919050506105b4565b005b6101cc6004805050610677565b005b6101e460048080359060200190919050506106a5565b005b600360005054600560005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505411156102a0578073ffffffffffffffffffffffffffffffffffffffff166000600360005054604051809050600060405180830381858888f1935050505050600360005054600560005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055506102a5565b6102a6565b5b50565b60206040519081016040528060008152602001503073ffffffffffffffffffffffffffffffffffffffff1631821015610314578273ffffffffffffffffffffffffffffffffffffffff16600083604051809050600060405180830381858888f1935050505050610355565b604060405190810160405280601781526020017f526566756e6420616d6f756e7420746f6f206c617267650000000000000000008152602001509050610356565b5b92915050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156103ed57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600260005054600560005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505411156104aa578073ffffffffffffffffffffffffffffffffffffffff166000600260005054604051809050600060405180830381858888f1935050505050600260005054600560005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055506104af565b6104b0565b5b50565b600460005054600560005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054111561056d578073ffffffffffffffffffffffffffffffffffffffff166000600460005054604051809050600060405180830381858888f1935050505050600460005054600560005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540392505081905550610572565b610573565b5b50565b6000600560005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506105af565b919050565b600160005054600560005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054111561066e578073ffffffffffffffffffffffffffffffffffffffff166000600160005054604051809050600060405180830381858888f1935050505050600160005054600560005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540392505081905550610673565b610674565b5b50565b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b565b600034905080600560005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055505b505056',
     gas: 4700000
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
/*Tx(0xaed2085e667b922b8c86438c129c6a2c84dbdf295f980f0417793ad8fb0b88e8)
created: 0x252d6c4b15dbc5b624c3d3785ed44d9ffbb13d04*/
