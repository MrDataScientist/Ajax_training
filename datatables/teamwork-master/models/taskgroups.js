/**
 * Created by wanglei on 2017/7/17.
 */

var TaskGroup = require('../lib/mongo').TaskGroup;

module.exports = {
    create: function create(taskstate) {
        return TaskGroup.create(taskstate).exec();
    },
    findState:function findState(proid) {
        return TaskGroup.find({pro_id:proid}).exec();
    },
    deleteState:function deleteState(proid,state) {
        return TaskGroup.remove({pro_id:proid,tas_state:state}).exec();
    }
};