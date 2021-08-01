import { Request, Response } from "express";
import { AuthFaild, LoginCredentioals } from "../interfaces/auth.service";
import { SignUpData } from "../interfaces/users.service";
import AuthService from "../services/auth";
import {join} from 'path'

export default class AuthController {
    // auth service
    private static authService = new AuthService();
    async login(req: Request, res: Response){
        // recive request body
        const userCredn: LoginCredentioals = req.body;
        // call login service
        try {
            const authRes = await AuthController.authService.login(userCredn);
            // if an errror in req body
            if(authRes === false) {
                res.status(400).send({err: 'error in your request body'} as AuthFaild)
            }
            // if user not exist
            if (authRes === null) {
                res.status(400).send({err: "User not exist"} as AuthFaild)
            }
            // no error and user founded
            if(authRes) {
                res.status(200).send(authRes)
            }
        } catch(err) {
            res.status(500).send(err)
        }
        // send the response
    }
    async signUp(req: Request, res: Response){
        // get user data
        const userData = req.body as SignUpData;
        // call users service
        try {
            const authRes = await AuthController.authService.signUp(userData);
            // if an error in request body
            if(authRes === false) {
                res.status(400).send({err: "error in your request body"});
                return
            }
            // if an error in request body
            if(authRes === null) {
                res.status(400).send({err: "user is already exist"});
                return
            }
            // there no error
            res.send(authRes)
        } catch(err) {
            res.status(500).send({err})
        }
    }
    async phoneVerification(req: Request, res: Response){
        const user_id = req.currentUser!;
        try {
            const service_res = await AuthController.authService.phoneVerificationDone(user_id);
            if(service_res === -1) {
                res.status(400).send({err: "user dosnot exist"})
                return
            }
            if(service_res === 0) {
                res.status(400).send({err: "User dosnot exist"})
                return
            }
            res.status(200).send(service_res)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    async resendVerificationCode(req: Request, res: Response){
        const cUser = req.currentUser!;
        // get the user
        try {
            // resend verification code 
            const resend_code_res = await AuthController.authService.resendVerificationCode(cUser);
            // check if sending code there no errors
            if(resend_code_res) {
                res.status(200).send({msg: "done"})
                return 
            }
            // if an error accure
            res.status(400).send({err: "client error"})
        } catch(err) {
            res.status(500).send({err: "internal server error"})
        }
    }
    // reset password request handler
    async resetPassword(req: Request<{}, {}, {email: string}>, res: Response){
        // user email
        const {email} = req.body;
        try {
            const resObj = await AuthController.authService.passwordReset(email);
            // if user dose not exist
            if(resObj === null) {
                res.status(400).send({err: "no email assosaited with this email"})
                return
            }
            // if an error in request body
            if(resObj === false) {
                res.status(400).send({msg: "error in your request body"})
                return
            }
            // there is no error
            res.status(200).send({msg: "email sended successfuly check your inbox"})
        } catch(err) {
            res.status(500).send({err: "internal server error"})
        }
    }
    // send veiew to the client when click the recover link
    async recoverView (req: Request, res: Response) {
        const {token} = req.params as {token: string};
        try {
            const checkTokenRes = await AuthController.authService.checkUrlToken(token);
            if(checkTokenRes) {
                res.sendFile(join(__dirname, '../public/index.html'))
                return
            }
            res.send("your token is not valid")
        } catch(err) {
            res.sendStatus(500)
        }
    }
    // when the user send his new password
    async reciverNewPassword(req: Request, res: Response)  {
        const {token} = req.params as {token: string};
        const {password} = req.body as {password: string, submitedPassword: string};
        try {
            const resetPassRes = await AuthController.authService.completePassReset({token, password});
            if(resetPassRes === false) {
                res.status(400).send({err: "your token is not valid"})
                return
            }
            res.status(200).send({msg: "done"})
        } catch(err) {
            res.sendStatus(500)
        }
    }
}