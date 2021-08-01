import { LoginCredentioals, AuthRes, VerifyTokenRejection, VerifyTokenRes } from "../interfaces/auth.service";
import { SignUpData, User } from "../interfaces/users.service";
import Users_Service from "./users";
import JWT from 'jsonwebtoken';
import sendMail from "./mailer";
import verifyPhoneNum from './sms'

export default class AuthService {
    private static users_service = new Users_Service()
    // signup service
    async signUp(userData: SignUpData): Promise<null | false | object>{
        // destruct the sign up data fields 
        const {phone, password, email, username} = userData;
        return new Promise(async (resolve, reject) => {
            // if an error accur in sign data
            if(password === undefined || email === undefined || username === undefined || phone === undefined) {
                resolve(false)
            }
            // try to check if user is exist
            try {
                // check if user is exist
                const User = await AuthService.users_service.findUser(userData.email);
                // if user is exist
                if(User) {
                    resolve(null)
                }
                // user dosnot exist so keep gooing
                // send verification code to the user
                try {
                    const code = await verifyPhoneNum(phone as string);
                    // try to add new user 
                    try {
                        const {_id} = await AuthService.users_service.addUser(userData);
                        const token = JWT.sign({_id, code}, process.env.TOKEN_SECRET!)
                        const resObj = {token};
                        resolve(resObj)
                    } catch(err) {
                        reject(err)
                    }
                } catch(err) {
                    reject(err)
                }
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
                const {username, phone, email, _id, password, gender, birthday} = user;
                const token = JWT.sign({_id}, process.env.TOKEN_SECRET!);
                const resObj: AuthRes = {
                    token,
                    user: { email, phone, username, password, gender, birthday}
                }
                return resObj
            }
            return user
        } catch(error) {
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
                    const {username, password, email, phone, gender, birthday} = user;
                    // generate token to this user
                    const token = JWT.sign({_id: user_id}, process.env.TOKEN_SECRET!);
                    // res object
                    const resObj = { token, user: {username, password, email, phone, gender, birthday} } as AuthRes
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
                const {phone} = user;
                // call the service
                await verifyPhoneNum(phone)
                return true
            }
            return false
        } catch(err){ return err}
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
            try {
                // save user
                await user.save();
                // the link that will send to the user
                const link = `http://localhost:${process.env.PORT || 5000}/auth/reset_password/${user.resetPasswordToken}`;
                // send the mail
                try {
                    await sendMail({link, email});
                    console.log('email send')
                    return true
                } catch(err) {
                    return err
                }
            } catch(err) {
                return err
            }
        } catch(err) {
            return err
        }
    }
    async checkUrlToken(token: string): Promise<false | User>{
        try {
            const checkTokenRes = await AuthService.users_service.findByToken(token);
            return checkTokenRes
        } catch(err) {
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
            try {
                await user.save()
                return true
            } catch(err) {
                return err
            }
        } catch(err) {
            return err
        }
    }
}