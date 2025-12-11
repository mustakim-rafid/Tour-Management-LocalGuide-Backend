import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRole } from "../../generated/prisma/enums";
import { dashboardController } from "./dashboard.controller";

const router = Router()

router.route("/admin").get(
    checkAuth(UserRole.ADMIN),
    dashboardController.adminDashboardInfo
)

router.route("/guide").get(
    checkAuth(UserRole.GUIDE),
    dashboardController.guideDashboardInfo
)

router.route("/tourist").get(
    checkAuth(UserRole.TOURIST),
    dashboardController.touristDashboardInfo
)

export const dashboardRoutes = router