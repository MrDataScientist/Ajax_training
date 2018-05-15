module.exports = {
     async create(ctx){
// try
         try {
              // create new record in Company
             ctx.body = await  ctx.db.Company.create({
                   name: ctx.request.body.name,
                   city: ctx.request.body.city,
                   address: ctx.request.body.address
               })
             // return a newly created record in the response
         }
         // catch
         catch (err) {
              ctx.throw(500, err);
         }
     },
    async find(ctx){
         try{
             ctx.body = await ctx.db.Company.findAll({});
             // ctx.body = await ctx.db.Company.findAll({});
         }
         catch (err){
             throw err;
         }
    },
    async findOne(ctx) {
        try {
            // get the company models
            // use the find one method from the company
            // find company on the based on id
            console.log(ctx.params.city);
            const company = await ctx.db.Company.findOne({
                where: { id: ctx.params.id }
            });
            if (!company) {
                ctx.throw(404, 'company id is invalid');
            }
            ctx.body = company;
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },


    // update method for the controller

    async update(ctx){
         try{
             const results = await ctx.db.Company.update({
                 name: ctx.request.body.name,
                 city: ctx.request.body.city,
                 address: ctx.request.body.address
             }, {
                 where: {
                     id: ctx.params.id
                 }
             });
             results == 0 ? ctx.throw(500,'invalid id provide') : ctx.body = `company is updated with id ${ctx.params.id}`;
         }
         catch (err) {
             ctx.throw(500, err)
         }
    }

};