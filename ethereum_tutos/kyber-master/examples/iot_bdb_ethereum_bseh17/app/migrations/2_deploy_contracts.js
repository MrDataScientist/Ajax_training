var TokenMock = artifacts.require("./TokenMock.sol");
var MobileEnergy = artifacts.require("./MobileEnergy.sol");

module.exports = function(deployer) {
  deployer.deploy(TokenMock).then(function() {
    return deployer.deploy(MobileEnergy, TokenMock.address);
  });
};
