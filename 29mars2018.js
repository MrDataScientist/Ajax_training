function myFunction() {

  var price = Drupal.settings.ether.price;
  var orderId = Drupal.settings.ether.orderId;
  var url = Drupal.settings.ether.url;
  var randomKey = Drupal.settings.ether.randomKey;
  var MY_ADDRESS = '0xfE7Fb0105f070a17E8fE210e33F0bE034Da1599D';

  if (typeof web3 === 'undefined') {
    return renderMessage('<div>You need to install <a href=“https://metmask.io“>MetaMask </a> to use this feature.  <a href=“https://metmask.io“>https://metamask.io</a></div>')
  }

  var user_address = web3.eth.accounts[0]

  web3.eth.sendTransaction({
      to: MY_ADDRESS,
      from: user_address,
      value: web3.toWei(price, 'ether'),
    },

    function (err, transactionHash) {
      if (err) return renderMessage('The payment could not be completed')

      // If you get a transactionHash, you can assume it was sent,
      // or if you want to guarantee it was received, you can poll
      // for that transaction to be mined first.

      //renderMessage('The payment has been successfully submitted')
      if (history.pushState) {hjk
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?para=hello';
          window.history.pushState({path:newurl},'',newurl);
      }
    })

  function renderMessage(message) {
    var messageEl = document.querySelector(".message")
    messageEl.innerHTML = message
  }




}
