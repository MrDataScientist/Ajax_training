(function ($) { Drupal.behaviors.ether =
  {
    attach: function (context, settings)

    {

    var orderId = Drupal.settings.ether.orderId;
    var lineItem = Drupal.settings.ether.lineItem;
    var price = Drupal.settings.ether.price;
    var address = Drupal.settings.ether.address;
    var abi = Drupal.settings.ether.abi;
    if (typeof web3 !== 'undefined') { web3 = new Web3(web3.currentProvider); }
    else { web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); }

    console.log(web3); web3.eth.defaultAccount = web3.eth.accounts[0]; 
    //document.getElementById("demo").innerHTML = web3.eth.accounts[5];
     //test account console.log(web3.eth.accounts[0]);
     // ABI var landsatContract = web3.eth.contract(abi);
     // account token var landsat = landsatContract.at(address); console.log(landsat); var landsatEvent = landsat.landsatEvent();
     /* landsatEvent.watch(function(error, result) { if (!error) { $("#loader").hide();
     $("#landsat").html('_orderId_:' + result.args.orderId + ' (lineItem_:' + result.args.lineItem + ' )' + ' Price_: ' + result.args.price + ' _SKU_: ' + result.args.sku); }
    else { $("#loader").hide(); } }); $("#button").click(function() { $("#loader").show(); landsat.setlandsat($("#orderId").val(), $("#lineItem").val(), $("#price").val(), $("#sku").val() ); });
    */ landsat.getlandsat(function(error, result) { if (!error) { $("#landsat").html(result[0]+' ('+result[1]+')'+' ('+result[2]+')'); } else console.log(error); }); landsat.setlandsat(orderId, lineItem, price);
     //do not touch below } }; })(jQuery);
