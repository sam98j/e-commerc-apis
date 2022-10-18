import { User } from "../interfaces/users.service";

export function validate_user_updated_data(data: Partial<User>){
    const updated_data = {} as Partial<User>
    if(data.email !== undefined) {
        updated_data.email = data.email
    }
    if(data.user_name !== undefined) {
        updated_data.user_name = data.user_name
    }
    return updated_data
}