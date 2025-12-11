import { NextFunction, Request, Response } from "express"
import { UserRole } from "../generated/prisma/enums"
import { AppError } from "../utils/AppError"
import httpStatus from "http-status"
import config from "../config"
import { TUserJwtPayload } from "../types"
import { verifyToken } from "../helper/jwt"

export const checkAuth = (...roles: UserRole[]) => async (req: Request & { user?: TUserJwtPayload }, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken
        
        if (!token) {
            throw new AppError(httpStatus.NOT_FOUND, "Token is missing")
        }

        const decodedToken = verifyToken(token, config.jwt.access_token_secret!)

        if (!roles.includes(decodedToken.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
        }
        
        req.user = decodedToken

        next()
    } catch (error) {
        next(error)
    }
}