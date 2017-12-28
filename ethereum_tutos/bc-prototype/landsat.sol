pragma solidity ^0.4.18;

contract landsat{

   uint orderId;
   uint lineItem;
   uint price;
   uint sku;
   address owner;

   function Owned() public{
       owner = msg.sender;
   }

   modifier onlyOwner{
       require(msg.sender == owner);
       _;
   }

    event landsat(
      uint orderId,
      uint lineItem,
      uint price,
      uint sku
    );

   function setlandsat(uint _orderId, uint _lineItem, uint _price, uint _sku) public {
       orderId = _orderId;
       lineItem = _lineItem;
       price = _price;
       sku = _sku;
       landsat(_orderId, _lineItem, _price, _sku);
   }

   function getlandsat() view public returns (uint, uint, uint, uint) {
       return (orderId, lineItem, price, sku);
   }

}
