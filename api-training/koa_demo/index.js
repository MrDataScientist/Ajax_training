const Koa = require('koa'),
      Router = require('koa-router');

const app = new Koa(),
      router = new Router();

let users = [
  {
    name : 'jacob',
    email: 'jacob@gmail.com'
  },
  {
    name : 'moises',
    email: 'moises@gmail.com'
  },
  {
    name : 'adam',
    email: 'adam@gmail.com'
  },
  {
    name : 'eve',
    email: 'eve@gmail.com'
  }
];

//http get method
router.get('/user/:id', ctx =>{
  ctx.body = users[ctx.params.id];
});

//http post method
router.post('/user/:id', ctx =>{
  ctx.body = Object.assign(users[ctx.params.id], ctx.request.body);
});

//middleware
app
    .use(require('koa-body')())
    .use(router.allowedMethods())
    .use(router.routes());


app.listen(3000);
