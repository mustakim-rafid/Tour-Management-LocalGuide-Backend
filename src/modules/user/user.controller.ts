import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status"

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createAdmin(req)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Admin created successfully",
        data: result
    })
})

const createGuide = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createGuide(req)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Guide created successfully",
        data: result
    })
})

const createTourist = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createTourist(req)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tourist created successfully",
        data: result
    })
})

export const userController = {
    createAdmin,
    createGuide,
    createTourist
}