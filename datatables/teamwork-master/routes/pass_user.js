/**
 * Created by wanglei on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
router.get('/',function(req, res, next) {
    res.render('pass_user');
});
router.post('/',function(req, res, next) {
    var name=req.fields.name;
    console.log(name);
    UserModel.getUserByName(name).then(function (user) {
        if(!user){//用户不存在
            req.flash('error','无此用户');
            return res.redirect('/pass_user');
        }
        return res.redirect('/pass_secret/'+name);
    }).catch(next);
});

module.exports = router;