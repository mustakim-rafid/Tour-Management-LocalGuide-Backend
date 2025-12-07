import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRole } from "../../generated/prisma/enums";
import { reviewController } from "./review.controller";
import { zodValidator } from "../../middleware/zodValidator";
import { reviewInputZodSchema } from "./review.validation";

const router = Router()

router.route("/").post(
    checkAuth(UserRole.TOURIST),
    zodValidator(reviewInputZodSchema),
    reviewController.createReview
)

export const reviewRoutes = router