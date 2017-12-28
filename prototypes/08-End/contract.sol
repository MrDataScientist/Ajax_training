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

contract Courses is Owned{

    struct Instructor {
        uint age;
        bytes16 fName;
        bytes16 lName;
    }

    mapping (address => Instructor) instructorss;
    address[] public instructorAccts;

    event instructorInfo(
      bytes16 fName,
      bytes16 lName,
      uint age,
      );

    function setinstructor(address _address, uint _age, bytes16 _fName, bytes16 _lName) onlyOwner public {
        var instructor = instructors[_address];

        instructor.age = _age;
        instructor.fName = _fName;
        instructor.lName = _lName;


        instructorAccts.push(_address) -1;
        instructorInfo(_fName, _lName, _age);
    }

    function getinstructors() view public returns(address[]) {
        return instructorAccts;
    }

    function getinstructor(address _address) view public returns (uint, bytes16, bytes16) {

        return (instructors[_address].age, instructors[_address].fName, instructors[_address].lName);

    }

    function countinstructors() view public returns (uint) {
        return instructorAccts.length;
    }

}
