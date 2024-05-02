import validRequest from "../utils/ValidRequest.js";
import * as Yup from "yup"; 

export const signInSchema = Yup.object({
    body: Yup.object({
        login: Yup.string()
            .required("Обязательное поле.")
            .max(25, "Максимальная длина - 25 символов"),
        password: Yup.string()
            .required("Обязательное поле.")
            .min(5, "Минимальная длина - 5 символов")
            .max(60, "Максимальная длина - 25 символов"),
    }),
});

export const signUpSchema = Yup.object({
    body: Yup.object({
      login: Yup.string()
        .required("Поле обязательно!")
        .max(25, "Максимальная длина - 25 символов"),
      password: Yup.string()
        .required("Поле обязательно!")
        .min(5, "Пароль слишком короткий - минимум 3 символа")
        .max(60, "Максимальная длина - 60 символов"),
    }),
  });

export const logoutSchema = Yup.object({
    cookies: Yup.object({
        refreshToken: Yup.string()
            .required("Обязательное поле"),
    }),
});

class AuthValidator {
    static async signIn(req,res,next){
        return validRequest(req,res,next,signInSchema);
    }
    static async signUp(req,res,next){
        return validRequest(req,res,next,signUpSchema);
    }
    static async logout(req,res,next){
        return validRequest(req,res,next,logoutSchema);
    }
    static async refresh(req,res,next){
        return validRequest(req,res,next);
    }
}


export default AuthValidator;