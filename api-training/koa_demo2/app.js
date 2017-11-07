var koa = require('koa');
var router = require('koa-router');
var app = new koa();

var _ = router();

_.get('/:id', sendID);

function *sendID(){
   this.body = 'The id you specified is ' + this.params.id;
}

app.use(_.routes());
app.listen(3000);
