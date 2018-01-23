/**
 * Created by wanglei on 2017/6/28.
 */
var User = require('../lib/mongo').User;

module.exports = {
    // 注册一个用户
    create: function create(user) {
        return User.create(user).exec();
    },
    // 通过用户名获取用户信息
    getUserByName: function getUserByName(name) {
        return User
            .findOne({ use_name: name })
            .addCreatedAt()
            .exec();
    },
    updateInfoByName:function  updateInfoByName(name,data) {
        return User.update({use_name:name},{$set:data}).exec();
    },
    getUser: function getUser(name) {
        return User
            .find({ use_name:name})
            .addCreatedAt()
            .exec();
    },
    getAvater:function getAvatar(name) {
        return User.find({use:name}).exec();
    }
};