/**
 * Created by wanglei on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var SecretModel = require('../models/secrets');
var question1='d';
var question2='d';
var answer1='a';
var answer2='a';
var name='';
router.get('/:username',function(req, res, next) {
    name=req.params.username;
    SecretModel.findSecret(name).then(function (result) {
        console.log(result.length);
        question1=result[0].sec_que;
        answer1=result[0].sec_ans;
        question2=result[1].sec_que;
        answer2=result[1].sec_ans;
        res.render('pass_secret',{que1:question1,que2:question2});
    });
 //  console.log(question1);
});
router.post('/:username',function(req, res, next) {
   var ans1=req.fields.answer1;
   var ans2=req.fields.answer2;
   try{
       if(ans1!=answer1){
           throw new Error("密保1答案错误");
       }
       if(ans2!=answer2){
           throw new Error("密保2答案错误");
       }
   } catch (e) {
       req.flash('error', e.message);
     //  console.log(e.message);
       return res.redirect('/pass_secret/'+name);
   }
   return res.redirect('/pass_revise/'+name);
});

module.exports = router;