pragma solidity ^0.4.13;

contract Greeter {
	string greeting;

	function greeter(string _greeting) public {
		greeting = _greeting;
	}

	function greet() constant returns (string){
		return greeting;
	}
}
