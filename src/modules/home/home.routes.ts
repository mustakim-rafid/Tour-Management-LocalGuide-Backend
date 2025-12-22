import { Router } from "express";
import { homeController } from "./home.controller";

const router = Router()

router.route("/").get(homeController.stats)

export const homeRoutes = router