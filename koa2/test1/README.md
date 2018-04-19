
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
