module.exports = {
    async create(ctx){
// try
        try {
            // create new record in Template
            ctx.body = await  ctx.db.Template.create({
                SKU: ctx.request.body.SKU,
                data: ctx.request.body.data,
                version: ctx.request.body.version
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
            ctx.body = await ctx.db.Template.findAll({});
            // ctx.body = await ctx.db.Template.findAll({});
        }
        catch (err){
            throw err;
        }
    },
    async findOne(ctx) {

        try {
            // get the Template models
            // use the find one method from the Template
            // find Template on the based on id
            console.log(ctx.params.SKU);
            const Template = await ctx.db.Template.findOne({
                where: { SKU: ctx.params.SKU }
            });
            if (!Template) {
                ctx.throw(404, 'Template SKU does not exist');
            }
            ctx.body = Template;
        }
        catch (err) {
            ctx.throw(500, err);
        }
    }
};