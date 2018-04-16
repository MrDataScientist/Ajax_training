import express from 'express';
import { MemberController } from '../controllers/member.controller';

const router = express.Router();
const MemberCtrl = new MemberController();

router.route('/')
    /** GET /api/members - Get list of members */
    .get(MemberCtrl.getAllMembers);

router.route('/numberofmembers')
    /** GET /api/members/numberofmembers - Get number of members */
    .get(MemberCtrl.numberOfMembers);

router.route('/ownerdetails')
    /** GET /api/members/ownerdetails - Get details of owner */
    .get(MemberCtrl.getOwnerDetails);

router.route('/memberdetails')
    /** GET /api/members/memberdetails - Get details of members */
    .get(MemberCtrl.memberdetails);

router.route('/getaccounts')
    /** GET /api/members/getaccounts - Get accounts */
    .get(MemberCtrl.getAccounts);

router.route('/memberdetailsbyemail')
    /** GET /api/members/memberdetailsbyemail - Get details of members */
    .post(MemberCtrl.getMemberDetailsByEmail);

router.route('/memberdetailsbyaccount')
    /** GET /api/members/memberdetailsbyaccount - Get details of members */
    .post(MemberCtrl.getMemberDetailsByAccount);

router.route('/getbalance')
    /** POST /api/members/getbalance - get eth balance of a member */
    .post(MemberCtrl.getBalance);

router.route('/addmember')
    /** POST /api/members/addmember - Add a new member */
    .post(MemberCtrl.addMember);

router.route('/removemember')
    /** POST /api/members/removemember - Remove a existing member */
    .post(MemberCtrl.removeMember);

router.route('/unlockaccount')
    /** POST /api/members/unlockAccount - Unlock member account */
    .post(MemberCtrl.unlockAccount);

export default router;