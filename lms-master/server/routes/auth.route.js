import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();
const AuthCtrl = new AuthController();

// router.route('/')

router.route('/create_account')
    /** POST /api/auth/create_account - Create account of member */
    .post(AuthCtrl.createAccount);

router.route('/getlmskeys/')
    .get(AuthCtrl.getAllLmsKey)

router.route('/clearlmskeys/')
    .get(AuthCtrl.clearAllLmsKey)

/* router.route('/updatelmskey/:email/:lmskey')
    .get(AuthCtrl.updateLmsKey) */

export default router;