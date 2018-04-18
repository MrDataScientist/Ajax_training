const koa = require('koa');
const app = new koa();
const PORT = 4000;

app.use(async (ctx, next) =>{
  console.log(`${ctx.method} ${ctx.url} ${new Date()}`);
  return await next();
})

app.use(async (ctx, next) =>{
  console.log(`2nd middleware`);
  return await next();
})

app.use(async ctx =>{
  ctx.body = 'Hello World';
})

app.listen(PORT);

// to show which port our server is running on
console.log(`server is listening on PORT ${PORT}`);
