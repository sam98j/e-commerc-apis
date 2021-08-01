import { User } from "../interfaces/users.service";

export function validate_user_updated_data(data: Partial<User>){
    const updated_data = {} as Partial<User>
    if(data.email !== undefined) {
        updated_data.email = data.email
    }
    if(data.username !== undefined) {
        updated_data.username = data.username
    }
    if(data.phone !== undefined) {
        updated_data.phone = data.phone
    }
    if(data.gender !== undefined) {
        updated_data.gender = data.gender
    }
    if(data.phone !== undefined) {
        updated_data.birthday = data.birthday
    }
    return updated_data
}