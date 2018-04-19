
## First example
/* **TEST1**
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
*/


## pet example

const _ = require('koa-route');

const koa = require('koa');
const app = new koa();
const PORT = 4000;

// import the koa-router
// create a root route
// welcome to koa application


const db = {
    tobi: { name: 'tobi', species: 'ferret' },
    loki: { name: 'loki', species: 'ferret' },
    jane: { name: 'jane', species: 'ferret' }
};

const pets = {
    list: (ctx) => {
        const names = Object.keys(db);
        ctx.body = 'pets: ' + names.join(', ');
    },

    show: (ctx, name) => {
        const pet = db[name];
        if (!pet) return ctx.throw('cannot find that pet', 404);
        ctx.body = pet.name + ' is a ' + pet.species;
    }
};


app.use(_.get('/pets', pets.list));
app.use(_.get('/pets/:name', pets.show));



app.listen(PORT);
// to show which port our server is running on
console.log(`server is listening on PORT ${PORT}`);

## example 3

const koa = require('koa');
// import the koa-router
const Router = require('koa-router');

const app = new koa();
const PORT = 4000;

// create a root route
const router = new Router();

// posts json dummy data
const posts = [
    {
        "id" : '1',
        "name" : "Node developer",
        "content" : "you should read this I"
    },
    {
        "id" : '2',
        "name" : "frontend developer",
        "content" : "you should read this II"
    },
    {
        "id" : '3',
        "name" : "Ethereum developer",
        "content" : "you should read this III"
    }
];

// welcome to koa application
router.get('/', (ctx, next) => {
    ctx.body = 'Welcome to koa application';
});

// create a new router
router.get('/posts', ctx => {
    ctx.body = posts;
})

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(PORT);
// to show which port our server is running on
console.log(`server is listening on PORT ${PORT}`);
