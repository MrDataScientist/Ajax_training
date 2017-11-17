pragma solidity ^0.4.18;


contract Owned{

    address owner;

    function owned() public{
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

}

contract CloudeoToken is Owned{

    struct Customer {

        bytes16 fName;
        bytes16 lName;
        uint age;
        bytes16 nationality;
        bytes16 company;
    }

    mapping (address => Customer) customers;
    address[] public customerAccts;

    event customerInfo(
      bytes16 fName,
      bytes16 lName,
      uint age,
      bytes16 nationality,
      bytes16 company
      );

    function setCustomer(address _address, bytes16 _fName, bytes16 _lName, uint _age, bytes16 _nationality, bytes16 _company) onlyOwner public {
        var customer = customers[_address];

        customer.fName = _fName;
        customer.lName = _lName;
        customer.age = _age;
        customer.nationality = _nationality;
        customer.company = _company;

        customerAccts.push(_address) -1;
        customerInfo(_fName, _lName, _age, _nationality, _company);
    }

    function getCustomers() view public returns(address[]) {
        return customerAccts;
    }

    function getCustomer(address _address) view public returns (bytes16, bytes16, uint, bytes16, bytes16) {

        return (customers[_address].company,customers[_address].nationality,customers[_address].age, customers[_address].fName, customers[_address].lName);

    }

    function countCustomers() view public returns (uint) {
        return customerAccts.length;
    }

}
