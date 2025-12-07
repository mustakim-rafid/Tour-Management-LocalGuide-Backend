import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TUserJwtPayload } from "../../types";

const tourPayment = catchAsync(async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await paymentService.tourPayment(bookingId, req.user as TUserJwtPayload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment url retrieved successfully",
    data: result,
  });
});

const paymentVerification = catchAsync(async (req: Request, res: Response) => {
    await paymentService.paymentVerification(req, res)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "WebHook req send successfully",
        data: {}
    })
})

export const paymentController = {
    tourPayment,
    paymentVerification
}
