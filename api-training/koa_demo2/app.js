var koa = require('koa');
var router = require('koa-router');
var app = new koa();

var test = router();

test.get('./hello', getMessage);

function *getMessage(){
   console.log(this.request);
   this.body = 'Your request has been logged.';
}

app.use(test.routes());
app.listen(3000);
