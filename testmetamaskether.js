(function ($) {

  Drupal.behaviors.ether = {
    attach: function (context, settings) {

      var orderId = Drupal.settings.ether.orderId;
      var lineItem = Drupal.settings.ether.lineItem;
      var price = Drupal.settings.ether.price;
      var web3environment = Drupal.settings.ether.web3Environment;
      var address = Drupal.settings.ether.address;
      var abi = Drupal.settings.ether.abi;

// -- CONNNECT TO METAMASK
      if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
      } else {
        console.log('Injected web3 Not Found!!!');
        // fallback - use your fallback strategy (local node / hosted node)
        //web3 = new Web3(new Web3.providers.HttpProvider(web3environment));
      }
      console.log(web3);

      // set the connect status on the apple
      if(web3 && web3.isConnect()){
        setData('connect_status','Connected',false);
        // gets the version data and populates the result UI
        setWeb3Version();
        if(autoRetrieveFlag) doGetAccounts();
      } else {
        setData('connect_status', 'Not Connectec', true);
      }

      if(!autoRetrieveFlag) return;
      doGetNodeStatus();
//----------------------------------------------------------------------------------
/**
 * Get the version information for Web3
 */

function    setWeb3Version() {

    var versionJson = {};

    // Asynchronous version
    web3.version.getNode(function(error, result){
        if(error) setData('version_information',error,true);
        else {
            setData('version_information',result,false);

            if(result.toLowerCase().includes('metamask')){
                nodeType = 'metamask';
            } else if(result.toLowerCase().includes('testrpc')){
                nodeType = 'testrpc';
            } else {
                nodeType = 'geth';
            }


            // set up UI elements based on the node type
            setUIBasedOnNodeType();
        }
    });
}
//----------------------------------------------------------------------------------------
// --GET ACCOUNTS
      web3.eth.defaultAccount = web3.eth.accounts[0];
      //document.getElementById("demo").innerHTML = web3.eth.accounts[5];

      //test account
      console.log(web3.eth.accounts[0]);

      // ABI
      var landsatContract = web3.eth.contract(abi);

      // account token
      var landsatAddress = landsatContract.at(address);

    console.log(landsatAddress);

      var landsatEvent = landsatAddress.landsatEvent();

      landsatAddress.getlandsat(function(error, result) {
        if (!error) {
          $("#landsat").html(result[0]+' ('+result[1]+')'+' ('+result[2]+')');
        } else
          console.log(error);
      });

      landsatAddress.setlandsat(orderId, lineItem, price);


//do not touch below
    }
  };

})(jQuery);
