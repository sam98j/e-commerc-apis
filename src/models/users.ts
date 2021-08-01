import mongoose from 'mongoose';
import { User, UsersModel } from '../interfaces/users.service';
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const UserScheam = new mongoose.Schema<User, UsersModel>({
    username: {
        required: "username is required field",
        type: String,
    },
    phone: {
        required: "phone is required field",
        type: String,
    },
    password: {
        required: "password is required field",
        type: String,
    },
    email: {
        required: "email is required field",
        type: String,
        trim: true,
        unique: true 
    },
    gender: {
        required: "gender is required field",
        type: String,
    },
    birthday: {
        required: "birthday is required field",
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
// mongoose pre_save
UserScheam.pre('save', function (next) {
    const user = this;
    // if user password not modified
    if(!user.isModified('password')) return next();
    // generate salt
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next();
        // create hash
        bcrypt.hash(String(user.password), salt,function(err, hash) {
            if(err) return err;
            // change user password with hashed password
            user.password = hash;
            next()
        })
    })
})
// compare password mongoose method
UserScheam.methods.comparePassword = function(password){
    // return unhashed password
    return bcrypt.compareSync(password, String(this.password))
}
// generate jsonwebtoken
UserScheam.methods.genJWT = function(){
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const {_id, username, email} = this;
    // token payload
    let payload = {_id, username, email};
    // return token
    return jwt.sign(payload, process.env.TOKEN_SECRET!, {
        expiresIn: parseInt(String(expirationDate.getTime() / 1000), 10)
    })
}
// generate password reset
UserScheam.methods.genPasswordReset = function(){
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000;
}
const UserModel = mongoose.model('users', UserScheam);
export default UserModel