const koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const app = new koa();
const PORT = 4000;
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

router.get('/', (ctx, next) => {
    ctx.body = 'Welcome to koa application';
});

router.get('/posts', ctx => {

    console.log(ctx.request.body);

    let {id, name, content} = ctx.request.body;

    if(!id){
        ctx.threw(400, 'id is required field')
    }

    if(!name){
        ctx.threw(400, 'name is required field')
    }

    if(!content){
        ctx.threw(400, 'content is required field')
    }


    posts.push({id, name, content});
    ctx.body = posts;
})

app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);
