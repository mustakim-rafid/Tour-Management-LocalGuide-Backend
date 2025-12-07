import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRole } from "../../generated/prisma/enums";
import { fileUploader } from "../../helper/fileUploader";
import { zodValidator } from "../../middleware/zodValidator";
import { tourInputZodSchema, tourUpdateZodSchema } from "./tour.validation";
import { tourController } from "./tour.controller";

const router = Router()

router.route("/").post(
    checkAuth(UserRole.GUIDE),
    fileUploader.upload.single("image"),
    zodValidator(tourInputZodSchema, "tour"),
    tourController.createTour
)

router.route("/").get(
    tourController.getAllTours
)

router.route("/guide-tours").get(
    checkAuth(UserRole.GUIDE),
    tourController.getGuideTours
)

router.route("/:id").get(
    tourController.getTourById
)

router.route("/:id").patch(
    checkAuth(UserRole.GUIDE),
    zodValidator(tourUpdateZodSchema),
    tourController.updateTour
)

router.route("/:id").delete(
    checkAuth(UserRole.ADMIN, UserRole.GUIDE),
    tourController.deleteTour
)

export const tourRoutes = router