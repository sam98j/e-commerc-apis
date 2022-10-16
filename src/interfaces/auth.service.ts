export interface LoginCredentioals {
    email: String;
    password: String
}
export interface AuthRes {
    token: string;
    user: {
        user_name: String;
        full_name: String;
        email: String;
        date_of_birth: String
    }
}
export interface AuthFaild{
    err: String
}
// verifyTokenRejection
export interface VerifyTokenRejection {
    status: number;
    msg: String
}

export interface AuthRejection {
    status: number;
    err: String
}
// verify token methodreponse
export interface VerifyTokenRes {
    _id: string;
    code: string
}