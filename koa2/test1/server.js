const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-parser');

const app = new koa();
const PORT = 4000;
const router = new Router();

app.use(bodyParser());

const posts = [
    {
        "accountAddress" : "0xc697e19613caf7f7d1f4fhh06aab1e20cb79f5a6",
        "orderID" : "1"
    },
    {
        "accountAddress" : "0x00ff53b0cf722ddc0faad7a2ca4d7c9a6764089a ",
        "orderID" : "2"
    },
    {
        "accountAddress" : "0x10959a06d550083262726d711a7f301967ca58c4",
        "orderID" : "3"
    }
];

router.get('/', ctx => {
    ctx.body = posts;
});

router.post('/posts', ctx => {
    console.log(ctx.request.body);
    let {accountAddress, orderID} = ctx.request.body;
    if(!accountAddress){ctx.threw(400, 'accountAddress is required field')}
    if(!orderID){ctx.threw(400, 'orderID is required field')}
    posts.push({accountAddress, orderID});
    ctx.body = posts;
})

app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);
