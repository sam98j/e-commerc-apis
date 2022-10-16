import { LoginCredentioals, AuthRes, VerifyTokenRejection, VerifyTokenRes } from "../interfaces/auth.service";
import { SignUpData, User } from "../interfaces/users.service";
import Users_Service from "./users";
import JWT from 'jsonwebtoken';
import sendMail from "./mailer";
import verifyPhoneNum from './sms'
import { SignUpServiceErrRes } from "../constants/enums/auth.enums";
import { SignUpServiceRes } from "../constants/interfaces/auth.interface";

export default class AuthService {
    private static users_service = new Users_Service()
    // signup service
    async signUp(userData: SignUpData): Promise<SignUpServiceErrRes | SignUpServiceRes>{
        const {USER_EMAIL_EXIST, REQ_BODY_ERR, USER_NAME_EXIST} = SignUpServiceErrRes
        // destruct the sign up data fields 
        const {password, email, user_name} = userData;
        return new Promise(async (resolve, reject) => {
            // if an error accur in sign data
            if(password === undefined || email === undefined || user_name === undefined) {
                resolve(REQ_BODY_ERR)
            }
            // try to check if user is exist
            try {
                // check if user is exist
                const User = await AuthService.users_service.findUser(userData.email);
                // get user by username
                const getUserByUserName = await AuthService.users_service.findUserByUserName(user_name);
                // if user email is exist
                if(User) {
                    resolve(USER_EMAIL_EXIST)
                    return
                }
                // check if username is exist
                if(getUserByUserName) {
                    resolve(USER_NAME_EXIST)
                    return
                }
                // user dosnot exist so keep gooing
                // send verification code to the user
                // const randomCode = String(Math.random()).slice(2, 6);
                // // disable verify phone number
                // // const code = await verifyPhoneNum(phone as string);
                // (await sendMail({link: randomCode, email: email as string}))[0].statusCode;
                // try to add new user 
                const singedUser = await AuthService.users_service.addUser(userData);
                console.log(singedUser.full_name);
                // const token = JWT.sign({_id, code: randomCode}, process.env.TOKEN_SECRET!)
                resolve({
                    _id: singedUser.id, 
                    user_name: singedUser.user_name, 
                    full_name: singedUser.full_name, 
                    email: singedUser.email,
                    data_of_birth: singedUser.date_of_birth,
                    account_type: singedUser.account_type
                })
               
            } catch(err) {  
                reject(err)
            }
        })
    }
    // login service
    async login(credn: LoginCredentioals): Promise<AuthRes | false | null>{
        // call db
        try {
            const user = await AuthService.users_service.getUserByCred(credn);
            // check if user is exist
            if(user) {
                const {user_name, email, _id, date_of_birth, full_name} = user;
                const token = JWT.sign({_id}, process.env.TOKEN_SECRET!);
                const resObj: AuthRes = {
                    token,
                    user: { email, user_name, date_of_birth, full_name}
                }
                return resObj
            }
            return user
        } catch(error: any) {
            return error
        }
    }
    // phone verification complete
    async phoneVerificationDone(user_id: string): Promise<number | AuthRes>{
        return new Promise(async (resolve, reject) => {
            // if user_id is empty or undefined
            if(user_id === '' || user_id === undefined) {
                resolve(-1)
            }
            try {
                const user = await AuthService.users_service.findById(user_id);
                // check if user is exist
                if(user) {
                    const {user_name, email, date_of_birth, full_name} = user;
                    // generate token to this user
                    const token = JWT.sign({_id: user_id}, process.env.TOKEN_SECRET!);
                    // res object
                    const resObj = { token, user: {user_name, email, date_of_birth, full_name} } as AuthRes
                    resolve(resObj);
                    return
                }
                resolve(0)
            } catch(err) {
                reject(err)
            }
        })
    }
    // verify Token
    async verifyToken(bearerToken: any): Promise<Partial<VerifyTokenRes>>{
        console.log(bearerToken)
        return new Promise((resolve, reject) => {
            // check it's string and it's not undefinded
        if(typeof bearerToken === "string") {
            const token = bearerToken.split(' ')[1];
                JWT.verify(token, process.env.TOKEN_SECRET!, (err, data) => {
                    if(err) {reject({status: 400, msg: "Token not valid"} as VerifyTokenRejection)}
                    resolve(data as VerifyTokenRes)
                });
        }
        const rejObj: VerifyTokenRejection = {
            status: 400,
            msg: "Token not found"
        }
        reject(rejObj)
        })
    }
    // resend the verification code to the client
    async resendVerificationCode(cUserId: string): Promise<boolean>{
        // get the cUser phone number
        try {
            // get the user by the id
            const user = await AuthService.users_service.findById(cUserId)
            // if the user is exit
            if(user !== null) {
                // const {phone} = user;
                // // call the service
                // await verifyPhoneNum(phone)
                // return true
            }
            return false
        } catch(err:any){ return err}
    }
    // password reset service
    async passwordReset(email: string): Promise<boolean | null>{
        // if an email is empty or undefined
        if(email === undefined || email === '') {
            return false
        }
        try {
            // get the user
            const user = await AuthService.users_service.findUser(email)
            // if user is not exist
            if(user === null) {
                return null
            }
            // make resetPassword token and reset password expires
            user.genPasswordReset();
            await user.save();
            // the link that will send to the user
            const link = `http://localhost:${process.env.PORT || 5000}/auth/reset_password/${user.resetPasswordToken}`;
            // send the mail
            await sendMail({link, email});
            console.log('email send')
            return true
        } catch(err: any) {
            return err
        }
    }
    async checkUrlToken(token: string): Promise<false | User>{
        try {
            const checkTokenRes = await AuthService.users_service.findByToken(token);
            return checkTokenRes
        } catch(err: any) {
            return err
        }
    }
    // check toke and reset password 
    async completePassReset(data: {token: string, password: string}): Promise<boolean>{
        if(data.token === '' || data.token === undefined) {
            return false
        }
        try {
            const user = await AuthService.users_service.findByToken(data.token);
            // if is token not valid
            if(user === false) {
                return false
            }
            user.password = data.password;
            user.resetPasswordExpires = undefined;
            user.resetPasswordToken = undefined
            // user save
            await user.save()
            return true
        } catch(err: any) {
            return err
        }
    }
}