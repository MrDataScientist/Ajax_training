/**
 * Created by wanglei on 2017/6/30.
 */
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var checkLogin = require('../middlewares/check').checkLogin;
var ProjectModel = require('../models/projects');
var UserModel=require('../models/users');
var ParticipateModel = require('../models/participates');
var TaskModel=require('../models/tasks');
var ImplementModel=require('../models/implements');
var TaskGroupModel=require('../models/taskgroups');
var projectname;
var projectid;
router.get('/:projectid',checkLogin,function(req, res, next) {
    projectid=req.params.projectid;
   var pars=[];
   var users=[];
   var tasks=[];
   var avatars=new Array();
   var tas_users=[];
   var allusers;
   var not_start_tasks=[];
   var states=new Array();
   ProjectModel.findProjectByID(projectid).then(function (project) {
       projectname=project.pro_name;
   }).then(function () {
       ParticipateModel.findParticipater(projectid).then(function (participaters) {
           for(i in participaters){
               pars.push(participaters[i].use_name);
           }
       }).then(function () {
               for(j in pars){
                   users.push(UserModel.getUserByName(pars[j]));
               }
       }).then(function () {
           ImplementModel.findTaskByUsername(req.session.user.use_name).then(function (ts) {
               for(i in ts){
                   if(ts[i].tas_id.pro_id==projectid){
                       tasks.push(ts[i].tas_id);
                   }
               }
               Promise.all(users).then(function (results) {
                  allusers=results;
                   for(i in results){
                       avatars[results[i].use_name]=results[i].use_img;
                   }
               }).then(function () {
                   for(i in tasks){
                       tas_users.push(ImplementModel.findUserByTaskId(tasks[i]._id));
                   }
               }).then(function () {
                   Promise.all(tas_users).then(function (users) {
                      for(i in users) {
                          var join_users_avater = [];
                          for (j in users[i]) {
                              join_users_avater.push(avatars[users[i][j].use_name]);
                          }
                          tasks[i]['join_users_avatar'] = join_users_avater;
                      }
                   }).then(function () {
                       TaskGroupModel.findState(projectid).then(function (states) {
                           for(k in states){
                               states[k]['tasks']=[];
                           }
                           for(i in tasks){
                               if(tasks[i].tas_state=='待处理'){
                                   not_start_tasks.push(tasks[i]);
                               }
                               else{
                                   for(j in states){
                                       if(states[j].tas_state==tasks[i].tas_state){
                                          states[j]['tasks'].push(tasks[i]);
                                       }
                                   }
                               }
                           }
                           res.render('projectpage', {avatars:avatars,
                               tasks:not_start_tasks,
                               results: allusers,
                               projectname: projectname,
                               projectid:projectid,
                               leader:req.session.user,
                               states:states
                           });
                       })
                   })
               })
           })
       })
   })
});
router.post('/:peojectid',checkLogin,function(req, res, next) {
    var button=req.fields.next;
   console.log(button);
    if(button=='conserve'){
        var taskid=req.fields.taskid;
        var title=req.fields.title;
        var end_date=req.fields.end_date.toString();
        var note=req.fields.note;
        var priority=req.fields.priority;
        var state=req.fields.state;
        var update={
            tas_name:title,
            tas_end:end_date,
            tas_text:note,
            tas_priority:priority,
            tas_state:state
        };
        TaskModel.updateTask(taskid,update);
        return res.redirect('back');
    }
    else if(button=='delete'){
        var taskid=req.fields.taskid;
        ImplementModel.deleteIm(taskid);
        TaskModel.deleteTask(taskid);
        return res.redirect('back');
    }
    else if(button=='add_state'){
        var new_state={
            pro_id:projectid,
            tas_state:req.fields.statename
        }
        TaskGroupModel.create(new_state);
        return res.redirect('back');
    }
    else if(button=='del_state'){
        var state=req.fields.del_state_name;
       TaskGroupModel.deleteState(projectid,state);
        TaskModel.findTaskByState(projectid.toString(),state).then(function (result) {
            for(i in result ){
                ImplementModel.deleteIm(result[i]._id);
            }
            TaskModel.deleteTaskByState(projectid.toString(),state);
            return res.redirect('back');
        })
    }
    else if(button=='add_task') {
        var title=req.fields.title;
        var end_date=req.fields.end_date.toString();
        var note=req.fields.note;
        var names=req.fields.name;
        var start_date=getNowFormatDate();
        var priority=req.fields.pri_text_input;
        var newTask={
          tas_name:title,
            pro_id:projectid,
            tas_start:start_date,
            tas_end:end_date,
            tas_leader:req.session.user.use_name,
            tas_priority:priority,
            tas_text:note,
            tas_state:'待处理'
        };
        TaskModel.create(newTask).then(function (result) {
            var taskid = result.ops[0]._id;
            if (names) {
                for (i in names) {
                    var implement = {
                        use_name: names[i],
                        tas_id: taskid
                    };
                    ImplementModel.create(implement);
                }
            }
            else {
                var implement = {
                    use_name: req.session.user.use_name,
                    tas_id: taskid
                };
                ImplementModel.create(implement);
            }
            return res.redirect('back');
        });
    }
});

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes();
    return currentdate;
}
module.exports = router;