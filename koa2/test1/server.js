const koa = require('koa');
// import the koa-router
const Router = require('koa-router');

const app = new koa();
const PORT = 4000;

// create a root route
const router = new Router();

// posts json dummy data
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
]

// welcome to koa application
router.get('/', (ctx, next) => {
    ctx.body = 'Welcome to koa application';
});

// create a new router
router.get('/posts', ctx => {
    ctx.body = posts;
})

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(PORT);
// to show which port our server is running on
console.log(`server is listening on PORT ${PORT}`);
