import {Router} from 'express';
import AuthController from '../controllers/auth';
import checkUser, { checkCode } from '../middlewares/auth';
const authRouter = Router();
const {login, 
    signUp, 
    phoneVerification, 
    resetPassword, 
    recoverView, 
    reciverNewPassword
} = new AuthController()
authRouter.post('/login', login);
authRouter.post('/signup', signUp);
// authRouter.post('/is_email_avilable', checkEmailAvalibility);
authRouter.post('/email_verification', checkCode,phoneVerification)
authRouter.post('/resend_verification_code', checkUser)
authRouter.post('/reset_password', resetPassword)
authRouter.get('/reset_password/:token', recoverView)
authRouter.post('/reset_password/:token', reciverNewPassword)
export default authRouter