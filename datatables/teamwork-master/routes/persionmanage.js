/**
 * Created by wanglei on 2017/6/30.
 */
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var UserModel = require('../models/users');
router.get('/',checkLogin,function(req, res, next) {
    res.render('persionmanage',{user:req.session.user});
});
router.post('/',checkLogin,function(req, res, next) {
    var position=req.fields.position;
    var contact=req.fields.contact;
    var avatar='';
    if(req.files.avatar.name=='') {
        avatar = req.session.user.use_img;
        fs.unlink(req.files.avatar.path);
    }
    else {
        avatar = req.files.avatar.path.split(path.sep).pop();
    }
    if(contact==''){
        contact=req.session.user.use_contact;
    }
    if(position=='') {
        position = req.session.user.use_position;
    }
    // console.log(position);
    // console.log(contact);
    // console.log(avatar);
    UserModel.updateInfoByName(req.session.user.use_name,{use_position:position,use_contact:contact,use_img:avatar});
    req.session.user.use_img=avatar;
    req.session.user.use_position=position;
    req.session.user.use_contact=contact;
    return res.redirect('/persionmanage');
});
module.exports = router;