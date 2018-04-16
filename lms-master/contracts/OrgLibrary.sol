pragma solidity ^0.4.0;

import "./DataStore.sol";


library OrgLibrary {
    function registerOrganisation(address orgAddress, bytes32 key, address newAddress) public {
        var orgStore = DataStore(orgAddress);
        orgStore.addNew();
        var index = orgStore.count();

        orgStore.setAddressValue(sha3(key, index), newAddress);
        orgStore.setBytes32Index('org', key, index);
    }

    function getOrganisation(address orgAddress, bytes32 key) constant returns (address) {
        var orgStore = DataStore(orgAddress);
        var index = orgStore.getBytes32Index('org', key);
        return orgStore.getAddressValue(sha3(key, index));
    }

    function setOrganisation(address orgAddress, bytes32 key, address newAddress) {
        var orgStore = DataStore(orgAddress);
        var index = orgStore.getBytes32Index('org', key);
        return orgStore.setAddressValue(sha3(key, index), newAddress);
    }
}
