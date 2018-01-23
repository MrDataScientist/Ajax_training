/**
 * Created by wanglei on 2017/7/15.
 */
var File= require('../lib/mongo').File;
module.exports = {
    create: function create(file) {
        return File.create(file).exec();
    },
    findFile:function findFile(beforeid) {
        return File.find({fil_beforeid:beforeid}).exec();
    },
    findFileByName:function findFileByName(name) {
        return File.findOne({fil_name:name}).exec();
    },
    findFileById:function findFileById(fileid) {
        return File.findOne({_id:fileid}).exec();
    }
};