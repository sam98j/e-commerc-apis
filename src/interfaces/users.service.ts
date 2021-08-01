import { Document, Model } from "mongoose";

export interface User extends Document{
    _id: string,
    username: String,
    password: String,
    email: String,
    phone: string,
    birthday: string,
    gender: string,
    resetPasswordToken: undefined | string,
    resetPasswordExpires: Date | number | undefined,
    genPasswordReset(): void
}
export interface SignUpData extends Object {
    email: String;
    phone: String;
    username: String;
    password: String;
    birthday: string;
    gender: string
}
// interfce of user updated data
export interface UpdatedData {
    phone: String | undefined;
    username: String | undefined
}
// user mdoel
export interface UsersModel extends Model<User> {}