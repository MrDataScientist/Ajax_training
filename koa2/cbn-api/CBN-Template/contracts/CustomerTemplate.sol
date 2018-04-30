pragma solidity ^0.4.18;

contract Customer {
    // Restful Endpoints
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

    event Customers(
        string SKU,
        uint price,
        string OrderID
    );

    function setCustomer(string _SKU, uint _price, string _OrderID) public {
        SKU = _SKU;
        price = _price;
        OrderID = _OrderID;

        Customers(_SKU, _price, _OrderID);
    }

    function getCustomer() view public returns (string, uint, string) {
        return (SKU, price, OrderID);
    }
}