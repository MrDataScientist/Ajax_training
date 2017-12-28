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

    function setinstructor(address _address, bytes16 _fName, bytes16 _lName, uint _age, bytes16 _nationality, bytes16 _company) onlyOwner public {
        var instructor = instructors[_address];

        instructor.fName = _fName;
        instructor.lName = _lName;
        instructor.age = _age;
        instructor.nationality = _nationality;
        instructor.company = _company;

        instructorAccts.push(_address) -1;
        instructorInfo(_fName, _lName, _age, _nationality, _company);
    }

    function getinstructors() view public returns(address[]) {
        return instructorAccts;
    }

    function getinstructor(address _address) view public returns (bytes16, bytes16, uint, bytes16, bytes16) {

        return (instructors[_address].company,instructors[_address].nationality,instructors[_address].age, instructors[_address].fName, instructors[_address].lName);

    }

    function countinstructors() view public returns (uint) {
        return instructorAccts.length;
    }

}
