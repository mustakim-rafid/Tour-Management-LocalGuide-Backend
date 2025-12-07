import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { tourService } from "./tour.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { pick } from "../../helper/pick";
import { TUserJwtPayload } from "../../types";
import { BookingStatus } from "../../generated/prisma/enums";

const createTour = catchAsync(async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
  const result = await tourService.createTour(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(req.query, ["searchTerm", "tourFeeRange"]);
  const result = await tourService.getAllTours(
    filterOptions,
    paginationOptions
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour list retrieved successfully",
    data: result.date,
    meta: result.meta
  });
});

const getTourById = catchAsync(async (req: Request, res: Response) => {
  const tourId = req.params.id
  const result = await tourService.getTourById(tourId)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour retrieved successfully",
    data: result,
  });
})

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const result = await tourService.updateTour(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
  const result = await tourService.deleteTour(req.params.id, req.user as TUserJwtPayload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour deleted successfully",
    data: result,
  });
});

const getGuideTours = catchAsync(async (req: Request & { user?: TUserJwtPayload }, res: Response) => {
  const result = await tourService.getGuideTours(req.user as TUserJwtPayload, req.query.status as BookingStatus);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Guide Tours retrieved successfully",
    data: result,
  });
})

export const tourController = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  getGuideTours
};
