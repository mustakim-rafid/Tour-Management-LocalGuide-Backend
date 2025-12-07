import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRole } from "../../generated/prisma/enums";
import { zodValidator } from "../../middleware/zodValidator";
import { bookingInputZodSchema } from "./booking.validation";
import { bookingController } from "./booking.controller";

const router = Router()

router.route("/").post(
    checkAuth(UserRole.TOURIST),
    zodValidator(bookingInputZodSchema),
    bookingController.createBooking
)

router.route("/tourist-bookings").get(
    checkAuth(UserRole.TOURIST),
    bookingController.getTouristBookings
)

router.route("/confirm/:id").patch(
    checkAuth(UserRole.GUIDE),
    bookingController.confirmBooking
)

router.route("/cancel/:id").patch(
    checkAuth(UserRole.GUIDE, UserRole.TOURIST),
    bookingController.cancelBooking
)

export const bookingRoutes = router