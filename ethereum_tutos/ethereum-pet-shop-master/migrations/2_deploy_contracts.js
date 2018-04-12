var Adoptions = artifacts.require("./Adoption.sol");

module.exports = function(deployer){
    deployer.deploy(Adoptions);
}