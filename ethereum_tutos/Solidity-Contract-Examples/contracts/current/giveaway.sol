pragma solidity ^0.4.11;

contract xcontractFreeGiveaway
{
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    //get free tokens just by signing up!!
    uint endTimeStamp;
    address [] claimers;
    address admin;

    mapping(address => uint) balances;

    //can only claim once per address and for a limited amount of time
    modifier oneTimeClaim()
    {
        if(block.timestamp > endTimeStamp) throw;
        for(uint i =0; i < claimers.length; i++)
        {
            if(msg.sender == claimers[i]) throw;
        }
        _;
    }

    function(){ throw; }

    function xcontractFreeGiveaway()
    {
        admin = msg.sender;
        balances[admin] = 1000000000;
        //set expiry timestamp, one month from now
        endTimeStamp = block.timestamp + 2628000000;
    }

    function claimTokens() oneTimeClaim
    {
        uint userBalance = msg.sender.balance;
        //100 tokens per ether in balance
        uint tokenAmount = userBalance / 1000000000000;
        balances[msg.sender] += tokenAmount;
        claimers.push(msg.sender);
    }

    function transfer(address _to, uint256 _value) returns (bool success)
    {
        if (_to == 0x0) throw;
        if (balances[msg.sender] < _value) throw;
        if (balances[_to] + _value < balances[_to]) throw;
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function getBalance() returns (uint)
    {
        return balances[msg.sender];
    }

    function donate() payable
    {
        //if donating to admin you will get free tokens, 1 ether = 10k free tokens
        uint donationTokens = msg.value / 100000000000000;
        balances[msg.sender] += donationTokens;
        admin.transfer(this.balance);
    }

}
