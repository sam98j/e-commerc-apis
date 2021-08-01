export interface LoginCredentioals {
    email: String;
    password: String
}
export interface AuthRes {
    token: string;
    user: {
        username: String;
        phone: String;
        email: String;
        password: String;
        gender: string,
        birthday: string
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