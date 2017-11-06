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
  }
];

//http get method
router.get('/user/:id', ctx =>{
  ctx.body = users[ctx.params.id];
});

app
    .use(router.allowedMethods())
    .use(router.routes())
    .use(require('koa-body')());

app.listen(3000);
