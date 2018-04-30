const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-parser');

const app = new koa();
const PORT = 4000;
const router = new Router();

app.use(bodyParser());


app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);