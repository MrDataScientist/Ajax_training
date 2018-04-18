pragma solidity ^0.4.18;

contract Customer {

   string SKU;
   uint price;
   string OrderID;

   address owner;

   function Owned() public{
       owner = msg.sender;
   }

   modifier onlyOwner{
       require(msg.sender == owner);
       _;
   }

    event Customer(
       string SKU,
       uint price,
       string OrderID
    );

   function setCustomer(string _SKU, uint _price, string OrderID) public {
       SKU = _SKU;
       price = _price;
       OrderID = _OrderID;

       Customer(_SKU, _price, _OrderID);
   }

   function getCustomer() view public returns (string, uint, string) {
       return (SKU, price, OrderID);
   }

}
