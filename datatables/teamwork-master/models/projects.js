/**
 * Created by wanglei on 2017/6/30.
 */
var Project= require('../lib/mongo').Project;

module.exports = {
    //创建一个项目
    create: function create(project) {
        return Project.create(project).exec();
    },
    findProjectByLeader:function findProjectByLeader(leadername) {
        return Project
            .find({pro_leader:leadername })
            .addCreatedAt()
            .exec();
    },
    findProjectByLeaderAndPro:function findProjectByLeader(leadername,proname) {
        return Project
            .findOne({pro_leader:leadername ,pro_name:proname})
            .addCreatedAt()
            .exec();
    },
    findProjectByID:function findProjectByID (projectid) {
        return Project
            .findOne({_id:projectid})
           .addCreatedAt()
            .exec();
    },
    findProjectByName:function findProjectByName(name,proids) {
        return Project.find({pro_name:name,_id:{"$in":proids}}).exec();
    }
};
