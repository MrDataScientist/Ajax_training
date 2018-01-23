/**
 * Created by wanglei on 2017/7/14.
 */
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var url=require('url');
var Mongolass = require('mongolass');
var Promise = require('bluebird');
var checkLogin = require('../middlewares/check').checkLogin;
var ProjectModel = require('../models/projects');
var UserModel=require('../models/users');
var ParticipateModel = require('../models/participates');
var FileModel=require('../models/files')
var projectid;
var projectname;
var fileid;
router.get('/:fileid',checkLogin,function(req, res, next) {
    var us=req.originalUrl.toString().trim().split('/');
    projectid=us[2];
    fileid=req.params.fileid;
    //console.log(fileid);
    var pars=[];
    var users=[];
    FileModel.findFileById(Mongolass.Types.ObjectId(fileid.toString())).then(function (result) {
        if(result&&result.fil_type=='0'){
            //console.log(result);
            var path="public/image/avatar/"+result.fil_name;
            res.download(path);
        }
    ProjectModel.findProjectByID(projectid).then(function (project) {
        projectname=project.pro_name;
    }).then(function () {
        ParticipateModel.findParticipater(projectid).then(function (participates) {
            for (i in participates) {
                pars.push(UserModel.getUserByName(participates[i].use_name));
            }
        }).then(function () {
            Promise.all(pars).then(function (results) {
                users = results;
            }).then(function () {
                FileModel.findFile(Mongolass.Types.ObjectId(fileid.toString())).then(function (files) {
                    res.render('file',{files:files,users:users,projectname:projectname,projectid:projectid});
                })
            })
        })
        })
    })

});
router.post('/:fileid',checkLogin,function(req, res, next) {
    category=req.fields.category;
    filename=req.fields.filename;
    if(category=='create'){
        var file={
            fil_name:filename,
            fil_leader:req.session.user.use_name,
            fil_beforeid:Mongolass.Types.ObjectId(fileid.toString()),
            fil_type:'1',
            pro_id:projectid
        };
       FileModel.create(file);
    }
    else if(category=='upload'){
       var file=req.files.resource;
        var new_name=file.name;
       var new_path='e:\\\\nodejs\\\\teamwork\\\\public\\\\image\\\\avatar\\\\'+new_name;
        fs.renameSync(file.path,new_path);
        var file={
            fil_name:new_name,
            fil_leader:req.session.user.use_name,
            fil_beforeid:Mongolass.Types.ObjectId(fileid.toString()),
            fil_type:'0',
            pro_id:projectid
        };
        FileModel.create(file);
    }
   return res.redirect('/projectpage/'+projectid+'/file/'+fileid);
});
module.exports = router;