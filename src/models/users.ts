import mongoose from 'mongoose';
import { User, UsersModel } from '../interfaces/users.service';
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const UserScheam = new mongoose.Schema<User, UsersModel>({
    user_name: {
        required: "username is required field",
        type: String,
    },
    full_name: {
        required: "full_name is required field",
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
    date_of_birth: {
        required: "birthday is required field",
        type: String,
    },
    occupation: {
        required: "occupation is required field",
        type: String,
    },
    account_type: {
        required: "account_type is required field",
        type: Number,
    },
    have_image: {
        required: "have_image is required field",
        type: Number
    },
    stores: [],
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
    const {_id, user_name, email} = this;
    // token payload
    let payload = {_id, user_name, email};
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