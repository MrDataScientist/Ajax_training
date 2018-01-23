/**
 * Created by wanglei on 2017/6/28.
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('login');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
    var name=req.fields.name;
    var password=req.fields.pass;
    // console.log(name);
    // console.log(password);
    UserModel.getUserByName(name).then(function (user) {
        if(!user){//用户不存在
            req.flash('error','用户不存在');
            return res.redirect('/signin');
        }
        //检查密码
        if(password!=user.use_pass){
            req.flash('error', '用户名或密码错误');
            return res.redirect('/signin');
        }
        delete user.use_pass;
        req.session.user=user;
       return res.redirect('/mainpage');
    }).catch(next);
});

module.exports = router;