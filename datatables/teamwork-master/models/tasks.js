/**
 * Created by wanglei on 2017/7/7.
 */
var Task= require('../lib/mongo').Task;
module.exports = {
    create: function create(task) {
        return Task.create(task).exec();
    },
    findTaskByProId:function findTaskProId(pro_id,tas_state) {
        return Task.find({pro_id:pro_id,tas_state:tas_state}).exec();
    },
    updateTask:function  updateTask(taskid,data) {
        return Task.update({_id:taskid},{$set:data}).exec();
    },
    findTaskByTaskId:function findTaskByTaskId(taskid) {
        return Task.findOne({_id:taskid}).exec();
    },
    deleteTask:function deleteTask(taskid) {
        return Task.remove({_id:taskid}).exec();
    },
    deleteTaskByState:function deleteTaskByState(proid,state) {
        return Task.remove({pro_id:proid,tas_state:state}).exec();
    },
    findTaskByState:function findTaskByState(proid,state) {
        return Task.find({pro_id:proid,tas_state:state}).exec();
    }
}