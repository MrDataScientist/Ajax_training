// import { web3, lms } from '../helpers/web3.helper'
import request from 'request'
import config from '../config'
import User from '../models/user.model'
import LMSKeyMap from '../models/lms-key-map.model'
import { getRandomNumber } from '../helpers/function.helper'

export class AuthController {
    createAccount (req, res) {
        const userEmail = req.body.email
        let lmsKey = getRandomNumber().toString()
        LMSKeyMap.findOne({ email: userEmail }, function(err, lmsUser) {
            if(err) {
                console.log(err);  // handle errors!
            }
            if (!err && lmsUser !== null) {
                lmsKey = lmsUser.lmsKey
            } else {
                const userKey = new LMSKeyMap({
                    email: userEmail,
                    lmsKey: lmsKey,
                    created: Date.now()
                });
                userKey.save(function(err) {
                    if(err) {
                        console.log(err)  // handle errors!
                    } else {
                        console.log("saving userKey ...")
                    }
                })
            }
            const rpcData = {
                "jsonrpc":"2.0",
                "method":"personal_newAccount",
                "params":[lmsKey],
                "id":74
            }
            request({
                url: config.lms_url,
                method: 'POST',
                json: rpcData
            }, function(error, response, body) {
                if (error) {
                    res.send({
                        status: "failure",
                        data : body
                    });
                } else {
                    res.send({
                        status: "success",
                        data: body
                    });
                }
            })
        });
    }
    findOrCreateUser (profile, done) {
        User.findOne({ oauthID: profile.id }, function(err, user) {
            if(err) {
                console.log(err);  // handle errors!
            }
            if (!err && user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    email: profile.email,
                    created: Date.now()
                });
                user.save(function(err) {
                    if(err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }
        });
    }
    updateLmsKey (req, res) {
        const userEmail = req.params.email
        const lmsKey = req.params.lmskey
        console.log('update lms params', req.params);
        LMSKeyMap.findOne({ email: userEmail }, (err, userKey) => {
            if(err) {
                console.log(err);  // handle errors!
            }
            if (!err && userKey !== null) {
                userKey.lmsKey = lmsKey
                userKey.save((err) => {
                    if(err) {
                        console.log(err);  // handle errors!
                    } else {
                        res.json({
                            status: "Updated"
                        })
                    }
                })
            } else {
                const newUserKey = new LMSKeyMap({
                    email: userEmail,
                    lmsKey: lmsKey,
                    created: Date.now()
                });
                newUserKey.save((err) => {
                    if(err) {
                        console.log(err);  // handle errors!
                    } else {
                        res.json({
                            status: "Added"
                        })
                    }
                });
            }
        })
    }
    getAllLmsKey (req, res) {
        LMSKeyMap.find({}, (err, users) => {
            if(err){
                console.log(err);
            }
            res.json(users)
        })
    }
    clearAllLmsKey (req, res) {
        LMSKeyMap.remove({}, (err) => {
            if(err){
                console.log(err);
            }
            res.json({
                status: 'deleted all keys'
            })
        })
    }
}