import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { homeService } from "./home.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status"

const stats = catchAsync(
  async (req: Request, res: Response) => {
    const result = await homeService.stats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Stats data retrieved successfully",
      data: result,
    });
  }
);

export const homeController = {
    stats
}