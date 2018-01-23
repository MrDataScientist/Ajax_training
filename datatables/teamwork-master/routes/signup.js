/**
 * Created by wanglei on 2017/6/28.
 */
var path = require('path');
var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');
var SecretModel = require('../models/secrets');
// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('register');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
    var username=req.fields.username;
    var password=req.fields.pass;
    var question1=req.fields.question1;
    var question2=req.fields.question2;
    var answer1=req.fields.answer1;
    var answer2=req.fields.answer2;
    console.log(username);
    try {
        if(question1==question2){
            throw new Error('两个密保问题不能相同');
        }
    }catch (e) {
            req.flash('error', e.message);
           // console.log(e.message);
            return res.redirect('/signup');
        }
    var new_user={
        use_name:username,
        use_pass:password,
        use_img: "default.jpg",
        use_position: "",
        use_contact: ""
    };

    var secret1={
      use_name:username,
      sec_que:question1,
        sec_ans:answer1
    };
    var secret2={
        use_name:username,
        sec_que:question2,
       sec_ans:answer2
    };
    UserModel.getUserByName(username)
        .then(function (user) {
            if (user) {
                req.flash('error', '用户名重复');
                return res.redirect('back');
            }
            else{
                UserModel.create(new_user);
                SecretModel.create(secret1);
                SecretModel.create(secret2);
                req.flash('success', '注册成功');
                return res.redirect('/signin');
            }
        })
       .catch(next);
});
module.exports = router;