import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TokenService from "./token-service.js";
import { NotFound, Forbidden, Conflict, Unauthorized } from "../utils/Errors.js";
import RefreshSessionRepo from "../repositories/session-repository.js";
import UserRepo from "../repositories/user-repository.js";
import { ACCESS_TOKEN_EXP } from "../constants.js";

class AuthService {
  static async signIn({ login, password }) {
    const userData = await UserRepo.getUserData(login);
    
    if(!userData){
      throw new NotFound("Пользователь не найден");
    }

    const validPass = bcrypt.compareSync(password, userData.user_password);

    if(!validPass){
      throw new Unauthorized("Неверный логин или пароль");
    }

    const payload = {id: userData.id, login};

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionRepo.createRefreshSession({id: userData.id,refreshToken}); 

    return {
      accessToken, 
      refreshToken, 
      accessTokenExp: ACCESS_TOKEN_EXP,
      userId: userData.id
    };
  }

  static async signUp({ login, password, fullname }) {
    const userData = await UserRepo.getUserData(login);
    
    if(userData){
      throw new Conflict("Пользователь уже существует");
    }

    const hashedPass = await bcrypt.hashSync(password,8);
    const {id} = await UserRepo.createUser({
      login,
      hashedPass, 
      fullname
    });
    
    const payload = {id,login};

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionRepo.createRefreshSession({id,refreshToken});

    return {
      accessToken, 
      refreshToken, 
      accessTokenExp: ACCESS_TOKEN_EXP,
    }
  }

  static async logout(refreshToken) {
    await RefreshSessionRepo.deleteRefreshSession(refreshToken);
  }

  static async refresh({ currentRefreshToken }) {
    if(!currentRefreshToken){
      throw new Unauthorized();
    }

    const refreshSession = await RefreshSessionRepo.getRefreshSession(currentRefreshToken);

    if(!refreshSession){
      throw new Unauthorized();
    }

    await RefreshSessionRepo.deleteRefreshSession(currentRefreshToken);

    let payload;

    try {
      payload = await TokenService.verifyRefreshToken(currentRefreshToken);
    } catch (e) {
      throw new Forbidden(e);
    }

    const {id: id, user_login: login} = await UserRepo.getUserData(payload.login);

    const newPayload = {id,login};

    const accessToken = await TokenService.generateAccessToken(newPayload);
    const refreshToken = await TokenService.generateRefreshToken(newPayload);

    await RefreshSessionRepo.createRefreshSession({id,refreshToken});

    return {
      accessToken, 
      refreshToken, 
      accessTokenExp: ACCESS_TOKEN_EXP
    }
  }
}

export default AuthService;
