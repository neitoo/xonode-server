import pool from "../database/db.js";

class UserRepo {
    static async createUser({login,hashedPass,fullname, age, gender, admin}){
        const response = await pool.query("INSERT INTO users (user_login, user_password) VALUES ($1, $2) RETURNING *;",
        [login, hashedPass]);

        const userID = response.rows[0].id;

        await pool.query("INSERT INTO users_data (user_id, user_fullname, data_win, data_loose, user_status, user_age, user_gender, registration_date, admin) VALUES ($1, $2, 0, 0, 'true', $3, $4, CURRENT_DATE, $5)",
        [userID,fullname, age, gender, admin]);

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

    static async getUsers(){
        const response = await pool.query("SELECT * FROM users_data");

        return response.rows;
    }
}

export default UserRepo;