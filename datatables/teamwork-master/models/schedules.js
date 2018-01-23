/**
 * Created by wanglei on 2017/7/3.
 */
var Schedule= require('../lib/mongo').Schedule;
module.exports = {
    create: function create(schedule) {
        return Schedule.create(schedule).exec();
    },
    findScheduleByProId:function findScheduleByProId (projectid,scheids) {
        return  Schedule
            .find({pro_id:projectid,_id:{"$in":scheids}})
            .exec();
    },
    findScheduleBySchId:function findScheduleBySchId(schid) {
        return Schedule.find({_id:schid}).exec();
    }
};