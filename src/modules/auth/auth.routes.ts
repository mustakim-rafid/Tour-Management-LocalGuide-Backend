import { Router } from "express";
import { authController } from "./auth.controller";
import { zodValidator } from "../../middleware/zodValidator";
import { loginInputZodSchema } from "./auth.validation";

const router = Router()

router.route("/login").post(
    zodValidator(loginInputZodSchema),
    authController.login
)
router.route("/getme").get(authController.getMe)

// router.route("/refresh-token").post(authController.refreshToken)
// router.route("/change-password").patch(
//     checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
//     authController.changePassword
// )

export const authRoutes = router