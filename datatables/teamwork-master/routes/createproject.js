/**
 * Created by wanglei on 2017/6/30.
 */
var express = require('express');
var router = express.Router();

var ProjectModel = require('../models/projects');
var ParticipateModel = require('../models/participates');
var TaskGroupModel = require('../models/taskgroups');
var checkLogin = require('../middlewares/check').checkLogin;
router.get('/',checkLogin,function(req, res, next) {
    res.render('createproject');
});

router.post('/',checkLogin,function(req, res, next) {
    var proname=req.fields.proname;
    var protext=req.fields.protext;
    var user=req.session.user;
    console.log(user.use_name);
    ProjectModel.findProjectByLeaderAndPro(user.use_name,proname).then(function (result) {
        if(result){
            req.flash('error', '该项目已存在!');
            return res.redirect('back');
        }
        var project={
            pro_name:proname,
            pro_text:protext,
            pro_state:"待处理",
            pro_leader:user.use_name
        };
        // var  participate={
        //    pro_id:
        //     user_name:user.use_name
        // };
        ProjectModel.create(project).then(function (result) {
            //console.log(result);
            var  participate={
                 pro_id:result.ops[0]._id,
                use_name:user.use_name
            };
          ParticipateModel.create(participate);
          var task_state1={
              pro_id:result.ops[0]._id,
              tas_state:'进行中'
          };
            var task_state2={
                pro_id:result.ops[0]._id,
                tas_state:'已完成'
            };
          TaskGroupModel.create(task_state1);
          TaskGroupModel.create(task_state2);
            res.redirect('/mainpage');
        });
    }).catch(next);
});

module.exports = router;