import { Request, Response } from "express";
import { ChangePasswordRes } from "../constants/users.service";
import { UpdatedData, User } from "../interfaces/users.service";
import Users_Service from "../services/users";

export default class DataController {
    private static users_service = new Users_Service();
    // update user data
    async updateUserData(req: Request, res: Response){
        const updatedData: Partial<User> = req.body;
        // need to update user data
        try {
            const resData = await DataController.users_service.updateUserData(req.currentUser!, updatedData);
            if(resData === false) {
                res.status(400).send({err: "err in your req body"})
                return
            }
            res.status(200).send({msg: "user data updated successfuly"})
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // change user password
    async changeUserPassword(req: Request, res: Response){
        // req body {newpassword: string};
        const reqBody = req.body as {newPassword: String}
        const cUserId = req.currentUser!;
        try {
            const {DONE, NOTDONE, REJECT} = ChangePasswordRes;
            const resObj = await DataController.users_service.changeUsrPassword(cUserId, reqBody);
            // check for rejected
            if(resObj === DONE) {
                res.status(200).send({msg: "passwrod changed successful"})
            }
            // if passwrd don't changed
            if(resObj === NOTDONE) {
                res.status(500).end({msg: "erroro in server"})
            }
            // if an error in reqbody
            if(resObj === REJECT) {
                res.status(400).send({err: "error in your req body"})
            }
        } catch(err) {
            res.status(500).send(err)
        }
    }
}