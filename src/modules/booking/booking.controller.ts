import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import { TUserJwtPayload } from "../../types";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BookingStatus } from "../../generated/prisma/enums";

const createBooking = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await bookingService.createBooking(
      req.body,
      req.user as TUserJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  }
);

const getTouristBookings = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await bookingService.getTouristBookings(req.user as TUserJwtPayload, req.query.status as BookingStatus)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tourist's bookings retrieved successfully",
      data: result,
    });
  })

const confirmBooking = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await bookingService.confirmBooking(req.params.id, req.user as TUserJwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking confirmed successfully",
      data: result,
    });
  }
);

const cancelBooking = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await bookingService.cancelBooking(req.params.id, req.user as TUserJwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking cancelled successfully",
      data: result,
    });
  }
);

const completeBooking = catchAsync(
  async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
    const result = await bookingService.completeBooking(req.body.bookingIds, req.user as TUserJwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour completed successfully",
      data: result,
    });
  }
);

export const bookingController = {
  createBooking,
  getTouristBookings,
  confirmBooking,
  cancelBooking,
  completeBooking
};
