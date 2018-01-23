/**
 * Created by wanglei on 2017/7/3.
 */
var express = require('express');
var router = express.Router();
var url=require('url');
var Promise = require('bluebird');
var checkLogin = require('../middlewares/check').checkLogin;
var ProjectModel = require('../models/projects');
var ParticipateModel = require('../models/participates');
var UserModel = require('../models/users');
var ScheduleModel = require('../models/schedules');
var ArrangeModel = require('../models/arranges');
var projectid;
router.get('/',checkLogin,function(req, res, next) {
    var us=req.originalUrl.toString().trim().split('/');
    projectid=us[2];
    var join=[];
    join=[];
    var members=[];
    var prom=[];
    var joinmem={
         username :req.session.user.use_name,
          avatar:req.session.user.use_img
    };
    join.push(joinmem);
    ParticipateModel.findParticipater(projectid).then(function (users) {
        for(i in users){
            prom.push(UserModel.getUserByName(users[i].use_name));
        }
        Promise.all(prom).then(function (users) {
            for(i in users){
                var mem={
                    username:users[i].use_name,
                    avatar:users[i].use_img
                };
                members.push(mem);
            }
        }).then(function () {
          ProjectModel.findProjectByID(projectid).then(function (project) {
                //     console.log(members);
                res.render('addschedule',{projectname:project.pro_name,users:members,join:join});
            })
    })
    })
});

router.post('/',checkLogin,function(req, res, next) {
    var start_time=req.fields.starttime.toString();
    var end_time=req.fields.endtime.toString();
    var title=req.fields.title;
    var place=req.fields.place;
    var option=req.fields.optionsRadios;
    var name=req.fields.name;
    var mode="";
    if(option=="option1"){
        mode="隐私";
    }
    else{
        mode="非隐私";
    }
    var schedule={
        sch_name:title,
        pro_id:projectid,
        sch_place:place,
        sch_start:start_time,
        sch_end:end_time,
        sch_mod:mode,
        use_name:req.session.user.use_name
    };
   ScheduleModel.create(schedule).then(function (result) {
       var schid=result.ops[0]._id;
       if(name ){
           for (i in name) {
               var arrange = {
                   sch_id: schid,
                   use_name: name[i]
               };
               ArrangeModel.create(arrange);
           }
       }
       else{
           var arrange = {
               sch_id: schid,
               use_name:req.session.user.use_name
           };
           ArrangeModel.create(arrange);
       }
       return res.redirect('/projectpage/'+projectid+'/schedule');
   });
    //console.log(name);
    //var join=req.fields.jos;
    // console.log(option);
    // console.log(start_time);
    // console.log(end_time);
    //console.log(join);

});
module.exports = router;