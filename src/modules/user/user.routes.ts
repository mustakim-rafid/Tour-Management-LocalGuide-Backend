import { Router } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { zodValidator } from "../../middleware/zodValidator";
import { adminInputZodSchema, guideInputZodSchema, touristInputZodSchema } from "./user.validation";

const router = Router()

router.route("/create-admin").post(
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

export const userRoutes = router