import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { tourRoutes } from "../modules/tour/tour.routes";
import { bookingRoutes } from "../modules/booking/booking.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { reviewRoutes } from "../modules/review/review.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";

const router = Router();

const moduleRoutes: {
  path: string;
  route: Router;
}[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes
  },
  {
    path: "/tour",
    route: tourRoutes
  },
  {
    path: "/booking",
    route: bookingRoutes
  },
  {
    path: "/payment",
    route: paymentRoutes
  },
  {
    path: "/review",
    route: reviewRoutes
  },
  {
    path: "/dashboard",
    route: dashboardRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
