import UserRepo from "../repositories/user-repository.js";
import ErrorUtils from "../utils/Errors.js";

class UserController {
    static async getInfoUser(req,res){
        const {id} = req.body;

        try {
            const data = await UserRepo.getInfoUser(id);
            
            const {user_fullname, data_win, data_loose, user_status, admin} = data;

            return res.status(200).json({user_fullname, data_win, data_loose, user_status, admin});
        } catch (e) {
            return ErrorUtils.catchError(res, e);
        }
    }

    static async getAllUsers(req,res){
        try {
            const data = await UserRepo.getUsers();

            return res.status(200).json(data);
        } catch (e) {
            return ErrorUtils.catchError(res, e);
        }
    }
}

export default UserController;