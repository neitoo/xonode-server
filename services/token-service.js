import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Forbidden, Unauthorized } from "../utils/Errors.js";

dotenv.config();

class TokenService {
  static async generateAccessToken(payload) {
    return await jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn: "30m"});
  }

  static async generateRefreshToken(payload) {
    return await jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn: "15d"});
  }

  static async checkAccess(req, _, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")?.[1];

    if(!token){
      return next(new Unauthorized());
    }
    
    try {
      req.user = await TokenService.verifyAccessToken(token);
    } catch (e) {
      console.log(e);
      return next(new Forbidden(e));
    }

    next();
  }

  static async verifyAccessToken(accessToken){
    return await jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET);
  }

  static async verifyRefreshToken(refreshToken){
    return await jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
  }
}

export default TokenService;