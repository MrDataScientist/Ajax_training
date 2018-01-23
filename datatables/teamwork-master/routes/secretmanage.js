/**
 * Created by wanglei on 2017/6/30.
 */
var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var UserModel = require('../models/users');
router.get('/',checkLogin,function(req, res, next) {
    res.render('secretmanage');
});
router.post('/',checkLogin,function(req, res, next) {
    var old_pass=req.fields.old_pass;
    var new_pass1=req.fields.new_pass1;
    var new_pass2=req.fields.new_pass2;
    UserModel.getUserByName(req.session.user.use_name).then(function (user) {
        try{
            if(user.use_pass!=old_pass){
                throw new Error('旧密码错误');
            }
            if(new_pass1!=new_pass2){
                throw  new Error('两次新密码不相同');
            }
            UserModel.updateInfoByName(req.session.user.use_name,{use_pass:new_pass1});
            return res.redirect('/mainpage');
        }catch (e){
            req.flash('error', e.message);
            // console.log(e.message);
            return res.redirect('/secretmanage');
        }
    });
});
module.exports = router;