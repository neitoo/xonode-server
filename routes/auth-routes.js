import { Router } from "express";
import AuthController from "../controllers/auth-controller.js";
import AuthValidator from "../validations/valid.js";
import UserController from "../controllers/user-controller.js";

const router = Router();

router.post("/auth", AuthValidator.signIn, AuthController.signIn);
router.post("/registration", AuthValidator.signUp, AuthController.signUp);
router.post("/logout", AuthValidator.logout, AuthController.logout);
router.post("/refresh", AuthValidator.refresh, AuthController.refresh);

router.post("/a/user",UserController.getInfoUser);
router.get("/a/users", UserController.getAllUsers);

export default router;