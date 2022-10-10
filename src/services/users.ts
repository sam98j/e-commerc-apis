import { AuthRejection, LoginCredentioals } from "../interfaces/auth.service";
import { SignUpData, UpdatedData, User } from "../interfaces/users.service";
import UserModel from "../models/users";
import {ChangePasswordRes} from '../constants/users.service'
import { validate_user_updated_data } from "../helpers/users.service";

export default class Users_Service {
    // add User
    async addUser(userData: SignUpData): Promise<User>{
        return new Promise(async (resolve, reject) => {
            try {
                const res: any = await UserModel.insertMany(userData);
                resolve(res[0])
            } catch(err) {
                reject(err)
            }
        })
    }
    // find user by username
    async findUser(email: String): Promise<User | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await UserModel.findOne({email});
                resolve(user)
            } catch(err) {
                reject(err)
            }
        })
    }
    // find user by user name
    // find user by username
    async findUserByUserName(user_name: String): Promise<User | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await UserModel.findOne({user_name});
                resolve(user)
            } catch(err) {
                reject(err)
            }
        })
    }
    // get user by credentioals
    async getUserByCred(credn: LoginCredentioals): Promise<User | false | null>{
        const loginCredentioals: LoginCredentioals = {
            email: credn.email,
            password: credn.password
        };
        return new Promise(async (resolve, reject) => {
            if (loginCredentioals.password === undefined || loginCredentioals.email === undefined) {
                resolve(false)
            }
            // call to db
            try {
                const user = await UserModel.findOne(loginCredentioals);
                resolve(user)
            } catch(err) {
                reject(err)
            }
        })
    }
    // update user data
    async updateUserData(cUserId: string, updatedData: Partial<User>): Promise<boolean>{
        // get the fileds
        const {username, email, phone, birthday, gender} = updatedData;
        return new Promise(async(resovle, reject) => {
            // check if all of them are undefined
            if(username === undefined && email === undefined && phone === undefined && birthday === undefined && gender === undefined) {
                resovle(false)
            }
            // check if all of them are empty string
            if(username === "" && email === "" && phone === "" && birthday === "" && gender === "") {
                resovle(false)
            }
            // updated data
            const updated_data = validate_user_updated_data(updatedData)
            // update the database
            try {
                await UserModel.updateOne({_id: cUserId}, {...updated_data})
                resovle(true)
            } catch(err) {reject(err)}
        })
        // fields -> email, phone, username
        // every field of above maybe undefinded or empty
    }
    // change user password
    async changeUsrPassword(cUserId: string, data: {newPassword: String}): Promise<number>{
        const {DONE, NOTDONE, REJECT} = ChangePasswordRes;
        return new Promise(async (resolve, reject) => {
            // if an error in req body
            if(data.newPassword === undefined || data.newPassword === '') {
                resolve(REJECT)
            }
            try {
                const {n} = await UserModel.updateOne({_id: cUserId}, {$set: {password: data.newPassword}});
                // every thing is ok
                if(n === 1) {
                    resolve(DONE)
                }
                // error in db
                return NOTDONE
            } catch(err) {
                reject(err)
            }
        })
    }
    // find User by id
    async findById(_id: string): Promise<User | null>{
        return new Promise(async(resolve, reject) => {
            try {
                const user = await UserModel.findOne({_id})
                resolve(user)
            } catch(err) {reject(err)}
        })
    }
    // find user by token
    async findByToken(token: string): Promise<false | User>{
        return new Promise(async(resovle, reject) => {
            try {
                const user = await UserModel.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
                // if user is exist
                if(user === null) {
                    resovle(false);
                    return
                }
                resovle(user)
            } catch(err) {
                reject(err)
            }
        })
    }
    
}