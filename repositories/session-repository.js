import pool from "../database/db.js";

class RefreshSessionRepo {
    static async getRefreshSession(refreshToken){
        const response = await pool.query("SELECT * FROM refresh_sessions WHERE refresh_token=$1",[refreshToken]);

        if(!response.rows.length) return null;

        return response.rows[0];
    }

    static async createRefreshSession({id,refreshToken}){
        await pool.query("INSERT INTO refresh_sessions (user_id,refresh_token) VALUES ($1,$2)", [id,refreshToken]);

    }

    static async deleteRefreshSession(refreshToken){
        await pool.query("DELETE FROM refresh_sessions WHERE refresh_token=$1",[refreshToken]);
    }
}

export default RefreshSessionRepo;