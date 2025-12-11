import { Router } from "express";
import { authController } from "./auth.controller";
import { zodValidator } from "../../middleware/zodValidator";
import { loginInputZodSchema } from "./auth.validation";
import { UserRole } from "../../generated/prisma/enums";
import { checkAuth } from "../../middleware/CheckAuth";

const router = Router()

router.route("/login").post(
    zodValidator(loginInputZodSchema),
    authController.login
)
router.route("/getme").get(authController.getMe)

router.route("/refresh-token").post(authController.refreshToken)

router.route("/change-password").patch(
    checkAuth(UserRole.ADMIN, UserRole.GUIDE, UserRole.TOURIST),
    authController.changePassword
)

export const authRoutes = router