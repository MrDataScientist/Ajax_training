module.export = {
     async create(ctx){
// try
         try {
              // create new record in Company
             ctx.bod  ctx.db.Company.create({
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
     }
};