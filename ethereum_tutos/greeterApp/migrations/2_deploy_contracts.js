var Greeter = artifacts.require("./contracts/greeter.sol");

module.exports = function(deployer){
  deployer.deploy(greeter);
}
