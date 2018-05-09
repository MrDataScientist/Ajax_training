const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-parser');
const _= require('lodash');

// from the routes directory
const router = require('./routes'); // you dont need to write the index.js

const app = new koa();
const PORT = 4000;

//++++++++++ Database with sequelize +++++++++++++++++++++
const db = require('./models');
// this will return the promis
db.sequelize.sync()  // db.sequelize.sync({force:true})
    .then(() => console.log('models synced'))
    .catch(err => console.log(err));
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.context.db = db;
app.use(bodyParser());
app.use(router.routes());
/*app
    .use(router.routes())
    .use(router.allowedMethods());
*/


app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);
