var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});
exports.User = mongolass.model('User', {
    use_name: { type: 'string' },
    use_pass: { type: 'string' },
    use_img: { type: 'string' },
    use_position: { type: 'string'},
    use_contact: { type: 'string' }
});
//exports.User.index( {_id: -1 },{unique:true}).exec();
//exports.User.index({ use_name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一
exports.Secret=mongolass.model('Secret',{
    use_name:{type:'string'},
    sec_que:{type:'string'},
    sec_ans:{type:'string'}
});
//exports.Secret.index( {_id: -1 },{unique:true}).exec();
exports.Project=mongolass.model('Project',{
    pro_id:{type:Mongolass.Types.ObjectId},
    pro_name:{type:'string'},
    pro_text:{type:'string'},
    pro_state:{type:'string'},//待处理，进行中，已完成
    pro_leader:{type:'string'}
});
//exports.Project.index( {_id: -1 },{unique:true}).exec();
exports.Task=mongolass.model('Task',{
    tas_id:{type:Mongolass.Types.ObjectId},
    tas_name:{type:'string'},
    pro_id:{type:'string'},
    tas_start:{type:'string'},//data
    tas_end:{type:'string'},//data
    tas_leader:{type:'string'},
    tas_priority:{type:'string'},//int
    tas_text:{type:'string'},
    tas_state:{type:'string'}
});
//exports.Task.index( {_id: -1 },{unique:true}).exec();
exports.Schedule=mongolass.model('Schedule',{
    sch_id:{type:Mongolass.Types.ObjectId},
    sch_name:{type:'string'},
    pro_id:{type:'string'},
    sch_place:{type:'string'},
    sch_start:{type:'string'},
    sch_end:{type:'string'},
    sch_mod:{type:'string'},
    use_name:{type:'string'}
});
//exports.Schedule.index( {_id: -1 },{unique:true}).exec();
exports.File=mongolass.model('File',{
    fil_id:{type:Mongolass.Types.ObjectId},
    fil_name:{type:'string'},
    fil_leader:{type:'string'},
    fil_type:{type:'string'},
    fil_beforeid:{type:Mongolass.Types.ObjectId},
    pro_id:{type:Mongolass.Types.ObjectId}
});
//exports.File.index( {_id: -1 },{unique:true}).exec();
exports.Implement=mongolass.model('Implement',{
    use_name:{type:'string'},
    tas_id:{type:Mongolass.Types.ObjectId,ref:'Task'},
});
//exports.Implement.index( {_id: -1 },{unique:true}).exec();
exports.Participate=mongolass.model('Participate',{
    use_name:{type:'string'},
       pro_id:{type:Mongolass.Types.ObjectId}
});
//exports.Participate.index( {_id: -1 },{unique:true}).exec();
exports.Arrange=mongolass.model('Arrange',{
   sch_id:{type:Mongolass.Types.ObjectId},
    use_name:{type:'string'}
});
exports.TaskGroup=mongolass.model('TaskGroup',{
    pro_id:{type:Mongolass.Types.ObjectId},
    tas_state:{type:'string'}
});
//exports.Arrange.index( {_id: -1 },{unique:true}).exec();

