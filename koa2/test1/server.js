const koa = require('koa');
const app = new koa();
const PORT = 4000;

app.listen(PORT);
console.log(`server is listening on PORT ${PORT}`);
