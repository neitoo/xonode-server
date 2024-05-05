import AuthService from "../services/auth-service.js";
import ErrorsUtils from "../utils/Errors.js";
import { COOKIE_SETTINGS } from "../constants.js";

class AuthController {
  static async signIn(req, res) {
    const {login, password} = req.body;

    try {
      const {accessToken, refreshToken, accessTokenExp, userId} = await AuthService.signIn({login,password});

      res.cookie("refreshToken",refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

      return res.status(200).json({accessToken,accessTokenExp, userId});
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const {login, password, fullname, age, gender} = req.body;

    try {
      const {accessToken, refreshToken, accessTokenExp} = await AuthService.signUp({login,password,fullname, age, gender});

      res.cookie("refreshToken",refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

      return res.status(200).json({accessToken,accessTokenExp});
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async logout(req, res) {
    const {refreshToken} = req.cookies.refreshToken;

    try {
      await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async refresh(req, res) {
    const currentRefreshToken = req.cookies.refreshToken;

    try {
      const { accessToken, refreshToken, accessTokenExp, id} = await AuthService.refresh({currentRefreshToken});

      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

      return res.status(200).json({ accessToken, accessTokenExp,id });
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }
}

export default AuthController;