import UserRepo from "../repositories/user-repository.js";

class UserController {
    static async getInfoUser(req,res){
        const {id} = req.body;

        try {
            const data = await UserRepo.getInfoUser(id);
            
            const {user_fullname, data_win, data_loose, user_status} = data;

            return res.status(200).json({user_fullname, data_win, data_loose, user_status});
        } catch (e) {
            return ErrorsUtils.catchError(res, e);
        }
    }
}

export default UserController;