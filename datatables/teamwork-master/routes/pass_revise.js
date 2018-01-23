/**
 * Created by wanglei on 2017/6/30.
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
var name='';
router.get('/:username',function(req, res, next) {
    name=req.params.username;
    res.render('pass_revise');
});
router.post('/:username',function(req, res, next) {
    var new_pass=req.fields.new_password;
    UserModel.updateInfoByName(name,{use_pass:new_pass});
    return res.redirect('/signin');
});

module.exports = router;