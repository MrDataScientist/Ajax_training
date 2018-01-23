/**
 * Created by wanglei on 2017/7/3.
 */
var Arrange= require('../lib/mongo').Arrange;
module.exports = {
    create: function create(arrange) {
        return Arrange.create(arrange).exec();
    },
    findArrange:function findArrange(schid,name) {
        return Arrange.find({sch_id:schid,use_name:{"$in":[name]}}).exec();
    },
    findArrangeByName:function findArrangeByName(name) {
        return Arrange.find({use_name:name}).exec();
    },
    findUser:function findUser(schid) {
        return Arrange.find({sch_id:schid}).exec();
    }
};