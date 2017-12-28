pragma solidity ^0.4.18;

contract customer {

   string fName;
   uint age;
   string nationality;
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
       uint age,
       string nationality
    );

   function setCustomer(string _fName, uint _age, string _nationality) public {

       fName = _fName;
       age = _age;
       nationality = _nationality;

       Customer(_fName, _age, _nationality);
   }

   function getCustomer() view public returns (string, uint, string) {
       return (fName, age, nationality);
   }

}
