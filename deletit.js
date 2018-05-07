const Router = require('koa-router');
/*
const db = require('./models');
// this will return the promis
db.sequelize.sync()
    .then(() => console.log('models synced'))
    .catch(err => console.log(err));
*/

const router = new Router();

// import web3
const Web3 = require('web3');
const web3 = new Web3();

// testRPC on Server : You can also use localhost:8545
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// get the account address
let account = web3.eth.accounts[0];

//function to get the balance of the account
let balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]),'ether');

const cbn = [
    {
        "provider" : "https://testrpc.cloudeo-ag.com:8584"
    }
];

const provider_status = [
    {
        "status" : "connected"
    }
];

const templates = [
    {
        "accountAddress" : "0xc697e19613caf7f7d1f4fhh06aab1e20cb79f5a6",
        "orderID" : "1"
    },
    {
        "accountAddress" : "0x00ff53b0cf722ddc0faad7a2ca4d7c9a6764089a ",
        "orderID" : "2"
    }
];

const template = [
    {
        "SKU" : "23",
        "version" : "5",
        "ABI" : "[{\"constant\":false,\"inputs\":[{\"name\":\"_SKU\",\"type\":\"string\"},{\"name\":\"_price\",\"type\":\"uint256\"},{\"name\":\"_OrderID\",\"type\":\"string\"}],\"name\":\"setCustomer\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getCustomer\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"uint256\"},{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"Owned\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"SKU\",\"type\":\"string\"},{\"indexed\":false,\"name\":\"price\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"OrderID\",\"type\":\"string\"}],\"name\":\"Customers\",\"type\":\"event\"}]"
    }
];

const cbncatalogue = [
    {
        "merchantID" : "79f5a6",
        "SKU" : "1",
        "accountAddress" : "0x00ff53b0cf722ddc0faad7a2ca4d7c9a6764089a "
    },
    {
        "merchantID" : "0ff53b ",
        "SKU" : "2",
        "accountAddress" : "0x00ff53b0cf722ddc0faad7a2ca4d7c9a6764089a "
    }
];

const abi = [
    {
        "ABI" : "[{\"constant\":false,\"inputs\":[{\"name\":\"_SKU\",\"type\":\"string\"},{\"name\":\"_price\",\"type\":\"uint256\"},{\"name\":\"_OrderID\",\"type\":\"string\"}],\"name\":\"setCustomer\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getCustomer\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"uint256\"},{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"Owned\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"SKU\",\"type\":\"string\"},{\"indexed\":false,\"name\":\"price\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"OrderID\",\"type\":\"string\"}],\"name\":\"Customers\",\"type\":\"event\"}]"
    }
];

// GET methods

router.get('/cbn', ctx => {
    ctx.body =cbn;
});

router.get('/cbn/provider-url', ctx => {
    ctx.body = cbn;
});

router.get('/cbn/provider-status', ctx => {
    ctx.body = provider_status;
});

router.get('/cbn/contract-deploy', ctx => {
    ctx.body =cbncatalogue;
});

router.get('/templates', ctx => {
    ctx.body =templates;
});

router.get('/templates/store-templates', ctx => {
    ctx.body =templates;
});

router.get('/templates/template', ctx => {
    ctx.body =template;
});

router.get('/templates/abi', ctx => {
    ctx.body = abi;
});

router.get('/cbn-catalogue', ctx => {
    ctx.body =cbncatalogue;
});


// POST Methods
router.post('/posts', ctx => {

    let {SKU, price, orderID} = ctx.request.body;

    if(!SKU){
        ctx.threw(400, 'SKU is required field');
    }
    if(!price){
        ctx.threw(400, 'price is required field');
    }
    if(!orderID){
        ctx.threw(400, 'orderID is required field');
    }
    posts.push({SKU, price, orderID});
});


// web3 functions return ---------------------------------------------
router.get('/account', ctx => {
    ctx.body = "AccountAdress: " + account +"  Balance: " + balance;
});

//---------------------------------------------------------
/*
router.post('/posts', ctx => {
    console.log(ctx.request.body);
    let {accountAddress, orderID} = ctx.request.body;
    if(!accountAddress){ctx.threw(400, 'accountAddress is required field')}
    if(!orderID){ctx.threw(400, 'orderID is required field')}
    posts.push({accountAddress, orderID});
    ctx.body = returnedValues;
});

app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(PORT);

console.log(`server is listening on PORT ${PORT}`);

*/
module.exports = router;
