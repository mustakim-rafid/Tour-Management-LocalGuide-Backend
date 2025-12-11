import { Router } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { zodValidator } from "../../middleware/zodValidator";
import { adminInputZodSchema, guideInputZodSchema, touristInputZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRole } from "../../generated/prisma/enums";

const router = Router()

router.route("/create-admin").post(
    checkAuth(UserRole.ADMIN),
    fileUploader.upload.single("profilePhoto"),
    zodValidator(adminInputZodSchema, "user"),
    userController.createAdmin
)

router.route("/create-guide").post(
    fileUploader.upload.single("profilePhoto"),
    zodValidator(guideInputZodSchema, "user"),
    userController.createGuide
)

router.route("/create-tourist").post(
    fileUploader.upload.single("profilePhoto"),
    zodValidator(touristInputZodSchema, "user"),
    userController.createTourist
)

router.route("/").get(
    checkAuth(UserRole.ADMIN),
    userController.getAllUsers
)

router.route("/").patch(
    checkAuth(UserRole.ADMIN, UserRole.GUIDE, UserRole.TOURIST),
    userController.updateUser
)

router.route("/soft-delete/:userId").patch(
    checkAuth(UserRole.ADMIN),
    userController.softDelete
)

export const userRoutes = router