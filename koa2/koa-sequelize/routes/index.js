const Router = require('koa-router');
const router = new Router();
const {CompanyController, TemplateController} = require('../controllers');

// define all your routes
router.post('/companies', CompanyController.create);
router.get('/companies', CompanyController.find);
router.get('/companies/:id', CompanyController.findOne);
router.put('/companies/:id', CompanyController.update);         // update route

// Template
router.post('/templates', TemplateController.create);
router.get('/templates', TemplateController.find);
router.get('/templates/:SKU', TemplateController.findOne);

module.exports = router;



//router.get('/companies/:id', CompanyController.findOne);
//router.get('/companies/:city', CompanyController.findOne);