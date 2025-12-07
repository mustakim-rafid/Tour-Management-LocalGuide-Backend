import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRole } from "../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router()

router.route("/:bookingId").post(
    checkAuth(UserRole.TOURIST),
    paymentController.tourPayment
)

export const paymentRoutes = router