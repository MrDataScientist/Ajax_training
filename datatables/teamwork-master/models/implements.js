/**
 * Created by wanglei on 2017/7/7.
 */
var Implement =require('../lib/mongo').Implement;
module.exports = {
    create: function create(implement) {
        return Implement.create(implement).exec();
    },
    findTaskByUsername:function findTaskByUserName(name) {
        return Implement.find({use_name:name}).populate({path:'tas_id',model:'Task'}).exec();
    },
    findUserByTaskId:function findUserByTaskId(taskid) {
        return Implement.find({tas_id:taskid}).exec();
    },
    deleteIm:function deleteIm(taskid) {
        return Implement.remove({tas_id:taskid}).exec();
    }
}