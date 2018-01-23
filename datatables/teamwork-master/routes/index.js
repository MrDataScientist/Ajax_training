/**
 * Created by wanglei on 2017/6/28.
 */
// var bodyParser = require('body-parser');
module.exports = function (app) {
    app.get('/', function (req, res) {
        req.session.user=null;
        res.redirect('/signin');
    });
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/mainpage', require('./mainpage'));
    app.use('/pass_user', require('./pass_user'));
    app.use('/pass_secret', require('./pass_secret'));
    app.use('/pass_revise', require('./pass_revise'));
    app.use('/projectpage',require('./projectpage'));
    app.use('/createproject',require('./createproject'));
    app.use('/persionmanage',require('./persionmanage'));
    app.use('/secretmanage',require('./secretmanage'));
    app.use('/projectpage/:projectid/addmember',require('./addmember'));
    app.use('/projectpage/:projectid/schedule',require('./schedule'));
    app.use('/projectpage/:projectid/file',require('./file'));
    app.use('/projectpage/:projectid/addschedule',require('./addschedule'));
    //app.use('/posts',require('./posts'));
};