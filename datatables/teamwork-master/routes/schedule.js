/**
 * Created by wanglei on 2017/7/3.
 */
/**
 * Created by wanglei on 2017/7/2.
 */
var express = require('express');
var router = express.Router();
var url=require('url');
var Promise = require('bluebird');
var checkLogin = require('../middlewares/check').checkLogin;
var ProjectModel = require('../models/projects');
var UserModel=require('../models/users');
var ParticipateModel = require('../models/participates');
var ArrangeModel = require('../models/arranges');
var ScheduleModel = require('../models/schedules');
var projectid;
var projectname;
router.get('/',checkLogin,function(req, res, next) {
    var us=req.originalUrl.toString().trim().split('/');
     projectid=us[2];
   var pars=[];
   var joinmem=[];
     var schids=[];
    var schedule=[];
    var users=[];
    var avatars=new Array();
    ProjectModel.findProjectByID(projectid).then(function (project) {
        projectname=project.pro_name;
    }).then(function () {
        ArrangeModel.findArrangeByName(req.session.user.use_name).then(function (join_schedule) {
          for(i in join_schedule){
              schids.push(join_schedule[i].sch_id)
          }
        }).then(function () {
            ScheduleModel.findScheduleByProId(projectid,schids).then(function (schs) {
                for(i in schs){
                    schedule.push(schs[i]);
                }
            }).then(function () {
                ParticipateModel.findParticipater(projectid).then(function (participates) {
                    for (i in participates) {
                        pars.push(UserModel.getUserByName(participates[i].use_name));
                    }
                }).then(function () {
                    Promise.all(pars).then(function (results) {
                        users = results;
                        //console.log(users);
                        for (i in results) {
                            avatars[results[i].use_name] = results[i].use_img;
                        }
                    }).then(function () {
                        for (i in schedule) {
                            joinmem.push(ArrangeModel.findUser(schedule[i]._id));
                        }
                        Promise.all(joinmem).then(function (members) {
                            //console.log(members);
                            for (i in members) {
                                var avatar = [];
                                for (j in members[i]) {
                                    avatar.push(avatars[members[i][j].use_name]);
                                }
                                //   console.log(avatar);
                                schedule[i]['avatars'] = avatar;
                            }
                        }).then(function () {
                            res.render('schedule', {
                                results: users,
                                projectname: projectname,
                                projectid: projectid,
                                schedule: schedule
                            });
                        })
                    })
                })
            })
        })
    })
});
router.post('/',checkLogin,function(req, res, next) {

});
module.exports = router;