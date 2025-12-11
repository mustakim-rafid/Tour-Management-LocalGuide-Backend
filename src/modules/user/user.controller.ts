import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../helper/pick";
import { paginationParameters, queryParameters } from "./user.constants";
import { TUserJwtPayload } from "../../types";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});

const createGuide = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createGuide(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Guide created successfully",
    data: result,
  });
});

const createTourist = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createTourist(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tourist created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const paginations = pick(req.query, paginationParameters);
  const filters = pick(req.query, queryParameters);
  const data = await userService.getAllUsers(paginations, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    success: true,
    meta: {
      ...data.meta,
    },
    data: data.sanitized,
  });
});

const updateUser = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await userService.updateUser(
      req.body,
      req.user as TUserJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: result,
    });
  }
);

const softDelete = catchAsync(async (req: Request, res: Response) => {
  await userService.softDelete(req.params.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: {},
  });
});

export const userController = {
  createAdmin,
  createGuide,
  createTourist,
  getAllUsers,
  updateUser,
  softDelete,
};
