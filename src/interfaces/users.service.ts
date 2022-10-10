import { Document, Model } from "mongoose";
import { Store } from "./stores.service";

export interface User extends Document{
    _id: string,
    username: String,
    password: String,
    email: String,
    phone: string,
    birthday: string,
    gender: string,
    stores: Store[],
    resetPasswordToken: undefined | string,
    resetPasswordExpires: Date | number | undefined,
    genPasswordReset(): void
}
export interface SignUpData extends Object {
    full_name: string;
    email: String;
    user_name: String;
    password: String;
    have_image: number;
    date_of_birth: string;
    occupation: any;
    account_type: number;
    country_code: number;
}
// interfce of user updated data
export interface UpdatedData {
    phone: String | undefined;
    username: String | undefined
}
// user mdoel
export interface UsersModel extends Model<User> {}