import {Router} from 'express';
import DataController from '../controllers/data';
import checkUser from '../middlewares/auth';
const dataRouter = Router();
const {updateUserData, changeUserPassword} = new DataController()
dataRouter.post('/edit_user_data', checkUser,updateUserData);
dataRouter.post('/change_password', checkUser, changeUserPassword);
export default dataRouter