const Router = require('koa-router');
const router = new Router();
const {CompanyController} = require('./controllers');

// define all your routes
router.post('/companies', CompanyController.create)

module.exports = router;