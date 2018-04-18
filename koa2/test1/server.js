const koa = require('koa');
const app = new koa();
const PORT = 4000;

app.listen(PORT);

// to show which port our server is running on
console.log(`server is listening on PORT ${PORT}`);
