const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-parser');
const Web3 = require('web3');

const app = new koa();
const PORT = 4000;
const router = new Router();
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

app.use(bodyParser());

const posts = [
    {
        "id" : '1',
        "name" : "Node developer",
        "content" : "you should read this I"
    },
    {
        "id" : '2',
        "name" : "frontend developer",
        "content" : "you should read this II"
    },
    {
        "id" : '3',
        "name" : "Ethereum developer",
        "content" : "you should read this III"
    }
];

app.use( async ( ctx ) => {
    let account = web3.eth.accounts[0]
    let balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]),'ether')
    await ctx.render('index', {
        account,balance
    })
})


router.get('/', ctx => {
    ctx.body = posts;
});

router.post('/posts', ctx => {
    console.log(ctx.request.body);
    let {id, name, content} = ctx.request.body;
    if(!id){ctx.threw(400, 'id is required field')}
    if(!name){ctx.threw(400, 'name is required field')}
    if(!content){ctx.threw(400, 'content is required field')}
    posts.push({id, name, content});
    ctx.body = posts;
})

app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);