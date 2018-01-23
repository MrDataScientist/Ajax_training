/**
 * Created by wanglei on 2017/6/28.
 */
var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
   req.session.user=null;
    res.redirect('/signin');
});

module.exports = router;