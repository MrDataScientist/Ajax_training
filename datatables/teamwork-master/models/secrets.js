/**
 * Created by wanglei on 2017/6/28.
 */
var Secret = require('../lib/mongo').Secret;

module.exports = {
    //用户密保
    create: function create(secret) {
        return Secret.create(secret).exec();
    },
    //查询密保
    findSecret:function findSecret(name) {
        return Secret.find({use_name:name}).addCreatedAt()
            .exec();
    }
};