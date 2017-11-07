var koa = require('koa');
var router = require('koa-router');
var app = new koa();

var _ = router(); //Instantiate the router

_.get('/hello', getMessage); // Define routes

function *getMessage() {
   this.body = "Hello world!";
};

app.use(_.routes()); //Use the routes defined using the router
app.listen(3000);
