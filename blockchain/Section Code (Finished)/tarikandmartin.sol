pragma solidity ^0.4.18;

contract kontract{

    struct kontract {
    uint price;
    bytes16 lineItem;
    }

    mapping (address => kontract) kontracts;
    address[] public kontractAccts;
    event kontractInfo(
    bytes16 lineItem,
    uint price
    );

    function setkontract(address _address, uint _price, bytes16 _lineItem)  public {
        var kontractadd = kontracts[_address];
        kontractadd.lineItem = _lineItem;
        kontractadd.price = _price;

        kontractAccts.push(_address) -1;
        kontractInfo(_lineItem, _price);
    }

    function getkontracts() view public returns(address[]) {
        return kontractAccts;
    }

    function getkontract(address _address) view public returns (uint, bytes16) {
        return (kontracts[_address].price, kontracts[_address].lineItem);
    }

    function countkontracts() view public returns (uint) {
        return kontractAccts.length;
    }
}