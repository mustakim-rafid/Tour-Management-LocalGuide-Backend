import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { TUserJwtPayload } from "../../types";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await reviewService.createReview(
      req.body,
      req.user as TUserJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: result,
    });
  }
);

export const reviewController = {
    createReview
}