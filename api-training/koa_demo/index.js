const koa = require('koa'),
      router = require('koa-router');

const app = new koa(),
      router = new router();
let users = [
  {
    name = 'jacob',
    email: 'jacob@gmail.com'
  },
  {
    name = 'moises',
    email: 'moises@gmail.com'
  },
  {
    name = 'adam',
    email: 'adam@gmail.com'
  }
]

app.use(router.allowedMethods())
    .use(router.routes())
    .use(require('koa-body')());

app.listen(3000);
