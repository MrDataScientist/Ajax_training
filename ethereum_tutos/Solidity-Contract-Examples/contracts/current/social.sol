//0xe70cbe3ba53aa230afd82b45df45e8ea91c87aa4
contract social {

  struct profile {
    string [] feed;
    string name;
    uint joinDate; //block time
    address [] friends;
  }

  address socialBot;
  uint memberCount;
  address [] members;

  modifier friendsOnly (address user){
    for(uint i = 0; i < memberCount; i++){
      if(users[msg.sender].friends[i] == user){
        _ return;
      }
    }
    throw;
  }

  modifier noEther() { if(msg.value != 0) throw; _ }
  /*modifier signupFee() { if(msg.value != 0.001 ether) throw; _ }*/

  mapping(address => profile) users;

  event _createUser(address indexed newUser);
  event _writeMessage(address indexed user, string indexed message);

  function social(){
    socialBot = msg.sender;
  }

  function signup(string name){
    users[msg.sender].name = name;
    users[msg.sender].joinDate = now;
    users[msg.sender].feed.push(name);
    users[msg.sender].friends.push(socialBot);
    memberCount++;
    members.push(msg.sender);
    _createUser(msg.sender);
  }

}
