const koa = require('koa');
// import the koa-router
const Router = require('koa-router');

const app = new koa();
const PORT = 4000;

// create a root route
const router = new Router();
// welcome to koa application
router.get('/', (ctx, next) => {
    //console.log('Welcome to Koa a middleware javascript framework!');
    return next();
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(PORT);
// to show which port our server is running on
console.log(`server is listening on PORT ${PORT}`);
