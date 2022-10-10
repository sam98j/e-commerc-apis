import { NextFunction, Request, Response } from "express";
import { VerifyTokenRejection } from "../interfaces/auth.service";
import AuthService from "../services/auth";

export default async function checkUser(req: Request, res: Response, next: NextFunction){
    const {verifyToken} = new AuthService();
    const bearerToken = req.headers.authorization;
    try {
        const resObj = await verifyToken(bearerToken);
        req.currentUser = resObj._id;
        next()
    } catch(err) {
        const {status, msg} = err as VerifyTokenRejection;
        res.status(status).send({msg})
    }
}

export async function checkCode(req: Request, res: Response, next: NextFunction){
    // get auth header that is token
    const bearerToken = req.headers.authorization;
    const {verifyToken} = new AuthService();
    // get pin code from req body
    const reqBody = req.body as {code: string};
    // validate reqBody
    if(reqBody.code === undefined || reqBody.code === '') {
        res.status(400).send({err: "error in your req body"});
        return
    }
    try {
        const resObj = await verifyToken(bearerToken);
        console.log(resObj.code, reqBody.code)
        // check if code send math the code generated
        if(resObj.code === reqBody.code) {
            req.currentUser = resObj._id;
            next()
        }
        if(resObj.code !== reqBody.code) {
            res.status(400).send({err: "code not valid"})
        }
    } catch(err) {
        const {status, msg} = err as VerifyTokenRejection;
        res.status(status).send({msg})
    }
}