/**
 * Created by wanglei on 2017/7/1.
 */
var Participate = require('../lib/mongo').Participate;
module.exports = {
    // 创建
    create: function create(participate) {
        return Participate.create(participate).exec();
    },
    findParticipater:function findParticipate(project) {
        return Participate.find({pro_id:project}).exec();
    },
    findProject:function findProject(name) {
        return Participate.find({use_name:name})
            .addCreatedAt()
            .exec();
    },
    findProjectByIdAndName:function findProjectByIdAndName(projectid,name) {
        return Participate.find({pro_id:projectid,use_name:name})
            .addCreatedAt()
            .exec();
    }
};