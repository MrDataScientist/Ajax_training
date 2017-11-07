var koa = require('koa');
var router = require('koa-router');
var app = koa();

var _ = router();

_.get('/hello', getMessage);

function *getMessage(){
   console.log(this.request);
   this.body = 'Your request has been logged.';
}

app.use(_.routes());
app.listen(3000);
