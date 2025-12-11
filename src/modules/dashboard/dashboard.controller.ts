import { Request, Response } from "express";
import { TUserJwtPayload } from "../../types";
import catchAsync from "../../utils/catchAsync";
import { dashboardService } from "./dashboard.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const adminDashboardInfo = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await dashboardService.adminDashboardInfo(
      req.user as TUserJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin's home dashboard info retrieved successfully",
      data: result,
    });
  }
);

const guideDashboardInfo = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await dashboardService.guideDashboardInfo(
      req.user as TUserJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Guide's home dashboard info retrieved successfully",
      data: result,
    });
  }
);

const touristDashboardInfo = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await dashboardService.touristDashboardInfo(
      req.user as TUserJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tourist's home dashboard info retrieved successfully",
      data: result,
    });
  }
);

export const dashboardController = {
  adminDashboardInfo,
  guideDashboardInfo,
  touristDashboardInfo
};
