import { web3, lms } from '../helpers/web3.helper'
import { isSuccess } from '../helpers/function.helper'
import LMSKeyMap from '../models/lms-key-map.model'

export class MemberController {
    getAllMembers (req, res) {
		lms.getAllMembers()
		.then((users) => {
			res.json({
				users,
				status: true
			})
		})
		.catch((err) => {
			console.log(err);
			res.json({
				logs: err.message,
				status: false
			})
		});
    }
	numberOfMembers (req, res) {
		lms.numMembers()
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			console.log(err);
		});
	}
	ownerdetails (req, res) {
		lms.getOwnerDetails()
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			console.log(err);
		});
	}
	getOwnerDetails (req, res){
		lms.getOwnerDetails()
		.then((user) => {
			console.log("owner details", user);
			res.json({
				user,
				status: true
			})
		})
		.catch((e) => {
			console.log("Error Occured", e)
			res.json({
				logs: e.message,
				status: false
			})
		})
	}
	memberdetails (req, res) {
		if ("email" in req.query) {
			console.log("Displaying member details by email : " + req.query.email);
			lms.getMemberDetailsByEmail(req.query.email)
			.then((result) => {
				res.json({ result });
			})
			.catch((err) => {
				console.log(err);
			});
		}
		else if ("adr" in req.query) {
			console.log("Displaying member details by account : " + req.query.adr);
			lms.getMemberDetailsByAccount(req.query.adr)
			.then((message) => {
				res.json({ message });
			})
			.catch((err) => {
				console.log(err);
			});
		}
		else if ("id" in req.query) {
			console.log("Displaying member details by index : " + req.query.id);
			lms.getMemberDetailsByIndex(req.query.id)
			.then((message) => {
				res.json({ message });
			})
			.catch((err) => {
				console.log(err);
			});
		}
	}
    getAccounts(req, res){
        web3.eth.getAccounts((e, accs) => {
            if (e != null) {
                console.log("Error Occured", e)
				res.json({
					logs: e.message,
					status: false
				})
            } else {
				res.json({
					accs,
					status: false
				})
            }
        })
    }
	getMemberDetailsByEmail (req, res){
		const data = req.body;
		lms.getMemberDetailsByEmail(data.email)
		.then((user) => {
			res.json({
				user,
				status: true
			})
		})
		.catch((e) => {
			console.log("Error Occured", e)
			res.json({
				logs: e.message,
				status: false
			})
		});
	}
	getMemberDetailsByAccount (req, res){
		const account = req.body;
		lms.getMemberDetailsByAccount(account)
		.then((user) => {
			res.json({
				user,
				status: true
			})
		})
		.catch((e) => {
			console.log("Error Occured", e)
			res.json({
				logs: e.message,
				status: false
			})
		});
	}
	addMember (req, res){
		const member = req.body;
		lms.addMember(member[0], member[1], member[2], {
            from: web3.eth.accounts[0],
            gas: 600000
          }).then((result) => {
            if(isSuccess(result)) {
              web3.eth.sendTransaction({
                from: web3.eth.accounts[0],
                to: member[1],
                value: web3.toWei(1000)
              }, (e, r) => {
                if(e){
					res.json({
						logs: e.message,
						status: false
					})
                }else{
					res.json({
						status: true
					})
				}
              })
            }else{
				res.json({
					logs: result.logs[0].args.statusCode.c[0],
					status: false
				})
            }
        }).catch((e) => {
			console.log("Error Occured", e)
			res.json({
				logs: e.message,
				status: false
			})
        })
	}
	removeMember (req, res){
		var data = req.body;
		lms.removeMember(data.address, {
				from: data.account,
				gas: 6000000
		})
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			console.log(err);
		});
	}
	getBalance (req, res){
		const data = req.body;
		web3.eth.getBalance(data.ownerDetails.account, (e, balance) => {
			if (e != null) {
				console.log("Error Occured", e)
				res.json({
					logs: e.message,
					status: false
				})
			} else {
				balance = web3.fromWei(balance, 'ether').toNumber()
				res.json({
					balance,
					status: true
				})
			}
		})
	}
	unlockAccount (req, res){
		const data = req.body
		LMSKeyMap.findOne({ email: data.email }, (err, lmsUser) => {
			if(err) {
                console.log(err);  // handle errors!
            }
            if (!err && lmsUser !== null) {
                const lmsKey = lmsUser.lmsKey
				web3.personal.unlockAccount(data.user, lmsKey, 0, (e, r) => {
					if(e) {
						res.json({
							logs: e.message,
							status: false
						})
					}else{
						res.json({
							status: true
						})
					}
				})
            } else {
				res.json({
					logs: 'Authentication failed due to key map',
					status: false
				})
			}
		})
	}
}