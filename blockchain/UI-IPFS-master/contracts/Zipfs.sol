pragma solidity ^0.4.8;
contract Zipfs {
 
    IpfsData[] public ipfsrecs;
    
    struct IpfsData {
        bytes32 addr1;
        bytes32 addr2; // address is split due to limitation of 32 chars in solidity and failure to handle arrays of strings
    }

    function addIpfs (bytes32 _addr1, bytes32 _addr2) payable returns (bool success) {
        IpfsData memory newIpfsData;
        newIpfsData.addr1 = _addr1;
         newIpfsData.addr2 = _addr2;

        ipfsrecs.push(newIpfsData);
        return true;
    }

    function getIpfsData() constant returns (bytes32[], bytes32[]) {

// solidity cannot handle arrays of strings hence we need this style of programming

        uint length = ipfsrecs.length;
        bytes32[] memory addr1array = new bytes32[](length);
        bytes32[] memory addr2array = new bytes32[](length);

        for (uint i=0; i<ipfsrecs.length; i++) {
            IpfsData memory currentIpfsRec;
            currentIpfsRec = ipfsrecs[i];

            addr1array[i]=currentIpfsRec.addr1;
            addr2array[i]=currentIpfsRec.addr2;
        

        }
        return (addr1array, addr2array);
    }


}