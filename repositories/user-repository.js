import pool from "../database/db.js";

class UserRepo {
    static async createUser({login,hashedPass,fullname}){
        const response = await pool.query("INSERT INTO users (user_login, user_password) VALUES ($1, $2) RETURNING *;",
        [login, hashedPass]);

        const userID = response.rows[0].id;

        await pool.query("INSERT INTO users_data (user_id, user_fullname, data_win, data_loose, user_status) VALUES ($1, $2, 0, 0, 'true')",
        [userID,fullname]);

        return response.rows[0];

    }

    static async getUserData(login){
        const response = await pool.query("SELECT * FROM users WHERE user_login=$1", [login]);

        if(!response.rows.length){
            return null;
        }

        return response.rows[0];
    }

    static async getInfoUser(id){
        const response = await pool.query("SELECT * FROM users_data WHERE user_id=$1", [id]);

        return response.rows[0];
    }
}

export default UserRepo;