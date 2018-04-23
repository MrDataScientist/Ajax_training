const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-parser');

const app = new koa();
const PORT = 4000;
const router = new Router();

app.use(bodyParser());

const posts = [
    {
        "SKU" : "1",
        "price" : "10",
        "orderID" : "11"
    },
    {
        "SKU" : "2",
        "price" : "20",
        "orderID" : "12"
    },
    {
        "SKU" : "3",
        "price" : "30",
        "orderID" : "13"
    }
];

router.get('/', ctx => {
    ctx.body = posts;
});

router.post('/posts', ctx => {
    console.log(ctx.request.body);
    let {SKU, price, orderID} = ctx.request.body;
    if(!SKU){ctx.threw(400, 'SKU is required field')}
    if(!price){ctx.threw(400, 'price is required field')}
    if(!orderID){ctx.threw(400, 'orderID is required field')}
    posts.push({SKU, price, orderID});
    ctx.body = posts;
})

app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);
