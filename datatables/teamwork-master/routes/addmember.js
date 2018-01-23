/**
 * Created by wanglei on 2017/7/2.
 */
var express = require('express');
var router = express.Router();
var url=require('url');
var checkLogin = require('../middlewares/check').checkLogin;
var UserModel = require('../models/users');
var ParticipateModel = require('../models/participates');
var projectid='';
var name;
router.get('/',checkLogin,function(req, res, next) {
    var us=req.originalUrl.toString().trim().split('/');
    projectid=us[2];
 //  console.log(us[2]);
    name=(req.url.toString().split("="))[1];
   if(!name){
       name='';
   }
   // console.log(name);
   // var membername=req.fields.membername;
    UserModel.getUser(name.toString()).then(function (users) {
        res.render('addmember',{users:users});
    })
});

router.post('/',checkLogin,function(req, res, next) {
    //console.log(name);
    ParticipateModel.findProjectByIdAndName(projectid,name).then(function (result) {
    //  console.log(result);
        if(result.length==0){
            var participate={
                pro_id:projectid,
                use_name:name
            };
             ParticipateModel.create(participate);
           // console.log(participate);
        }
        return res.redirect('/projectpage/'+projectid);
    });

});
module.exports = router;