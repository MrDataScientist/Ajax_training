const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-parser');


const app = new koa();
const PORT = 4000;
const router = new Router();

const db = require('./models');
// this will return the promis
db.sequelize.sync()
    .then(() => console.log('models synced'))
    .catch(err => console.log(err));


app.use(bodyParser());

app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);
