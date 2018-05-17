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
contract Cancel is Owned {
    function kill() {
        if (msg.sender == owner) selfdestruct(owner);
    }
}
contract Landsat is Owned{

    struct landsat {
        uint price;
        uint orderId;
        uint lineItem;
        uint sku;
    }

    mapping (address => landsat) landsats;
    address[] public landsatAccts;

    event landsatInfo(
      uint orderId,
      uint lineItem,
      uint price,
      uint sku

      );

    function setlandsat(address _address, uint _sku, uint _price, uint _orderId, uint _lineItem) onlyOwner public {
        var landsat = landsats[_address];

        landsat.orderId = _orderId;
        landsat.lineItem = _lineItem;
        landsat.price = _price;
        landsat.sku = _sku;

        landsatAccts.push(_address) -1;
        landsatInfo(_orderId, _lineItem, _price, _sku);
    }

    function getlandsats() view public returns(address[]) {
        return landsatAccts;
    }

    function getlandsat(address _address) view public returns (uint, uint, uint, uint) {
        return (landsats[_address].sku, landsats[_address].price, landsats[_address].orderId, landsats[_address].lineItem);
    }

    function countlandsats() view public returns (uint) {
        return landsatAccts.length;
    }

}
