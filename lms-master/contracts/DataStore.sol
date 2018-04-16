// An iterable data stored designed to be eternal.
// A more appropriate name could be IterableDataStore, but that's a mouthful.
// Create new instances for each logical entity e.g. one for books, one for members and so on.
// As is true for all Ethereum contracts, keep the contract addresses very safe, else you will lose all data.

pragma solidity ^0.4.0;

import "./helper_contracts/zeppelin/lifecycle/Killable.sol";


contract DataStore is Killable {
    // The data in this contract can be changed only by the owner, which should be the calling contract.
    uint public count;

    event Event(string eventName, uint indexed index, address indexed account, string value, uint indexed number, uint timestamp);

    function triggerEvent(string eventName, uint index, address account, string value, uint number) {
        Event(eventName, index, account, value, number, now);
    }

    function addNew() {
        // Invoke this function before adding a new record.
        // TODO Find if addNew can be called simultaneously. If yes, the below index will not point to correct entry.
        count++;
    }

    mapping (bytes32 => address) AddressStorage;
    mapping (bytes32 => uint) IntStorage;
    mapping (bytes32 => string) StringStorage;
    // An example Member Data Store:
    // {1: {'name': 'John Doe', 'email': 'john.doe@example.com'}}
    // {2: {'name': 'Johnny Appleseed', 'email': 'johnny.appleseed@icloud.com', 'address': '1, Infinite Loop'}}
    // Book Data Store: {1: {'title': '1984', 'author': '', 'publisher': '', 'imgUrl': ''}}

    function getAddressValue(bytes32 key) constant returns (address) {
        return AddressStorage[key];
    }

    function setAddressValue(bytes32 key, address value) onlyOwner {
        AddressStorage[key] = value;
    }

    function getIntValue(bytes32 key) constant returns (uint) {
        return IntStorage[key];
    }

    function setIntValue(bytes32 key, uint value) onlyOwner {
        IntStorage[key] = value;
    }

    function getStringValue(bytes32 key) constant returns (string) {
        // This function cannot be used by other contracts or libraries due to an EVM restriction
        // on contracts reading variable-sized data from other contracts.
        return StringStorage[key];
    }

    function setStringValue(bytes32 key, string value) onlyOwner {
        StringStorage[key] = value;
    }

    mapping(bytes32 => mapping (address => uint)) AddressIndex;
    mapping(bytes32 => mapping (bytes32 => uint)) Bytes32Index;
    mapping(bytes32 => mapping (int => uint)) IntIndex;

    function getAddressIndex(bytes32 indexName, address key) constant returns (uint) {
        return AddressIndex[indexName][key];
    }

    function setAddressIndex(bytes32 indexName, address key, uint index) onlyOwner {
        AddressIndex[indexName][key] = index;
    }

    function getBytes32Index(bytes32 indexName, bytes32 key) constant returns (uint) {
        return Bytes32Index[indexName][key];
    }

    function setBytes32Index(bytes32 indexName, bytes32 key, uint index) onlyOwner {
        Bytes32Index[indexName][key] = index;
    }

    function getIntIndex(bytes32 indexName, int key) constant returns (uint) {
        return IntIndex[indexName][key];
    }

    function setIntIndex(bytes32 indexName, int key, uint index) onlyOwner {
        IntIndex[indexName][key] = index;
    }
}
