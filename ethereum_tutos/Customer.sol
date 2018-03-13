pragma solidity ^0.4.18;



contract Customer {

   string fName;
   uint age;
   address owner;

   function Owned() public{
       owner = msg.sender;
   }

   modifier onlyOwner{
       require(msg.sender == owner);
       _;
   }

    event Customer(
       string name,
       uint age
    );

   function setCustomer(string _fName, uint _age) public {
       fName = _fName;
       age = _age;
       Customer(_fName, _age);
   }

   function getCustomer() view public returns (string, uint) {
       return (fName, age);
   }

}
