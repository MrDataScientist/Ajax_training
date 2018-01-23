/**
 * Created by wanglei on 2017/6/29.
 */
var express = require('express');
var Promise = require('bluebird');
var router = express.Router();
var ParticipateModel = require('../models/participates');
var ProjectModel=require('../models/projects');
var checkLogin = require('../middlewares/check').checkLogin;
var user="";
router.get('/',checkLogin,function(req, res, next) {
    var project_name=(req.url.toString().split('='))[1];
    //console.log(project_name);
    user=req.session.user;
    var pars=[];
    var pros=[];
    ParticipateModel.findProject(user.use_name).then(function (results) {
        for(i in results){
            pars.push(results[i].pro_id);
        }
    }).then(function () {
        if(!project_name) {
            for (par in pars) {
                pros.push(ProjectModel.findProjectByID(pars[par]));
            }
            Promise.all(pros).then(function (projects) {
                res.render('mainpage', {count: projects.length,projects:projects});
            })
        }
        else {
            ProjectModel.findProjectByName(project_name,pars).then(function (projects) {
                res.render('mainpage', {count: projects.length,projects:projects});
            })
        }
    })
});

module.exports = router;