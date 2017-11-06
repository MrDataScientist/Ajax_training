const koa = require('koa'),
      router = require('koa-router');

const app = new koa(),
      router = new router();
let users = [
  {
    
  }
]

app.use(router.allowedMethods())
    .use(router.routes())
    .use(require('koa-body')());

app.listen(3000);
