pragma solidity ^0.4.8;

contract Sale {
	uint public value;
	address public seller;
	address public buyer;
	enum State { Created, Locked, Inactive }
	State public state;

	function Sale() payable {
		seller = msg.sender;
		value = msg.value / 2;
		if (2 * value != msg.value) throw;
	}

	modifier require(bool _condition) {
		if (!_condition) throw;
		_;
	}

	modifier onlyBuyer() {
		if (msg.sender != buyer) throw;
		_;
	}

	modifier onlySeller() {
		if (msg.sender != seller) throw;
		_;
	}

	modifier inState(State _state) {
		if (state != _state) throw;
		_;
	}

	event Aborted(address indexed _sale, uint256 _time);
	event Purchased(address indexed _sale, uint256 _time);
	event Confirmed(address indexed _sale, uint256 _time);

	/// Abort the purchase and reclaim the ether.
	/// Can only be called by the seller before
	/// the contract is locked.
	function abort()
		onlySeller
		inState(State.Created)
	{
		Aborted(address(this), now);
		state = State.Locked;
		if (!seller.send(this.balance)) throw;
	}

	/// Confirm the purchase as buyer.
	/// Transaction has to include `2 * value` ether.
	/// The ether will be locked until confirmReceived
	/// is called.
	function purchase()
		inState(State.Created)
		require(msg.value == 2 * value)
		payable
	{
		Purchased(address(this), now);
		buyer = msg.sender;
		state = State.Locked;
	}

	/// Confirm that you (the buyer) received the item.
	/// This will release the locked ether.
	function confirm()
		onlyBuyer
		inState(State.Locked)
	{
		Confirmed(address(this), now);
		state = State.Inactive;
		if (!buyer.send(value) || !seller.send(this.balance)) throw;
	}
}
