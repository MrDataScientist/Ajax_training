/*
### web3js is an Ethereum Javascript Api
### source: https://github.com/ethereum/web3.js/
### After installation, you can use this function to call MetaMask
*/

// ***********this function call Metamask to make a payment transafert using ether Tokens**********************************************************
function MetamaskApi() {

  // reading the values from Drupal
  //ether is the configuration file in drupal for calling web3js library

  var price = Drupal.settings.ether.price;
  var orderId = Drupal.settings.ether.orderId;
  var url = Drupal.settings.ether.url;
  var randomKey = Drupal.settings.ether.randomKey;

  var MY_ADDRESS = '0xfE7Fb0105f070a17E8fE210e33F0bE034Da1599D'; // A static address on ethereum > you can check this account on etherscan.io


// this function is used to call Metamask
  if (typeof web3 === 'undefined') {
    return renderMessage('<div>You need to install <a href=“https://metmask.io“>MetaMask </a> to use this feature.  <a href=“https://metmask.io“>https://metamask.io</a></div>')
  }
 // To get the client account from MetaMask
  var user_address = web3.eth.accounts[0]


// function to send the transaction and as you can notice the web3.toWei is used to convert the ether token into a smaller currency called Wei
  web3.eth.sendTransaction({
      to: MY_ADDRESS,
      from: user_address,
      value: web3.toWei(price, 'ether'),
    },


// Here is the function for mining  the transaction in order to track the payment using function transactionHash (a web3 function)
    function (err, transactionHash) {
      if (err) return renderMessage('The payment could not be completed')

       /*  // If you get a transactionHash, you can assume it was sent,
           // or if you want to guarantee it was received, you can poll
           // for that transaction to be mined first.
           //renderMessage('The payment has been successfully submitted')
      */
      renderMessage('The payment has been successfully submitted')
    })

// rendering function
  function renderMessage(message) {
    var messageEl = document.querySelector(".message")
    messageEl.innerHTML = message

  }
}
