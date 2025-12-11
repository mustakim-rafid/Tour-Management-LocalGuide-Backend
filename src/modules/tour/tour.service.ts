import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../helper/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import {
  IPaginationParameters,
  normalizePaginationQueryParams,
} from "../../helper/normalizeQueryParams";
import { BookingStatus, Prisma } from "../../generated/prisma/client";
import { tourSearchableFields } from "./tour.constants";
import { getTourFeeFilter } from "../../helper/tourFeeFilter";
import { TUserJwtPayload } from "../../types";

const createTour = async (req: Request & { user?: TUserJwtPayload }) => {
  if (!req.file) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour image is required");
  }

  const uploadResponse = await fileUploader.uploadToCloudinary(req.file);
  req.body.image = uploadResponse?.secure_url;

  const tourDate = new Date(req.body.tourDate);

  const guide = await prisma.guide.findUniqueOrThrow({
    where: { email: req.user?.email },
  });

  const result = await prisma.tour.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      image: req.body.image,
      maxGroupSize: req.body.maxGroupSize,
      meetingPoint: req.body.meetingPoint,
      tourFee: req.body.tourFee,
      tourDate,
      guideId: guide.id,
    },
  });

  return result;
};

const getAllTours = async (
  filters: any,
  paginationOptions: Partial<IPaginationParameters>
) => {
  const { take, skip, page, sortBy, sortOrder } =
    normalizePaginationQueryParams(paginationOptions);

  const { searchTerm, tourFeeRange } = filters;

  const andConditions: Prisma.TourWhereInput[] = [];

  if (searchTerm && searchTerm.length > 0) {
    andConditions.push({
      OR: tourSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (tourFeeRange && tourFeeRange.length > 0) {
    andConditions.push({
      AND: getTourFeeFilter(tourFeeRange),
    });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const whereConditions: Prisma.TourWhereInput =
    andConditions.length > 0
      ? {
          AND: [
            ...andConditions,
            {
              tourDate: {
                gte: tomorrow,
              },
            },
          ],
        }
      : {
          tourDate: {
            gte: tomorrow,
          },
        };

  const result = await prisma.tour.findMany({
    take,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereConditions,
    include: {
      guide: {
        select: {
          name: true,
          email: true,
          avrgRating: true,
          experienceYears: true,
          profilePhoto: true,
        },
      },
      bookings: {
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          tourist: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.tour.count({
    where: whereConditions,
  });

  return {
    date: result,
    meta: {
      total,
      limit: take,
      page,
    },
  };
};

const getTourById = async (tourId: string) => {
  const result = await prisma.tour.findUniqueOrThrow({
    where: {
      id: tourId,
    },
    include: {
      guide: {
        select: {
          name: true,
          email: true,
          avrgRating: true,
          experienceYears: true,
          profilePhoto: true,
          reviews: {
            select: {
              rating: true,
              comment: true,
              tourist: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return result;
};

const getGuideTours = async (user: TUserJwtPayload, status?: BookingStatus) => {
  const result = await prisma.tour.findMany({
    where: {
      guide: {
        email: user.email,
      },
      ...(status
        ? {
            bookings: {
              some: {
                status,
              },
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      bookings: {
        include: {
          tourist: true,
        },
      },
    },
  });

  return result;
};

const updateTour = async (tourId: string, payload: any) => {
  if (payload?.tourDate) {
    payload.tourDate = new Date(payload.tourDate);
  }

  const result = await prisma.tour.update({
    data: payload,
    where: {
      id: tourId,
    },
  });

  return result;
};

const deleteTour = async (tourId: string, user: TUserJwtPayload) => {
  const hasBookings = await prisma.booking.findFirst({
    where: { tourId },
  });

  if (hasBookings) {
    throw new AppError(409, "Cannot delete tour with active bookings");
  }

  if (user.role === "GUIDE") {
    await prisma.tour.findUniqueOrThrow({
      where: {
        id: tourId,
        guide: {
          email: user.email,
        },
      },
    });
  }

  const result = await prisma.tour.delete({
    where: {
      id: tourId,
    },
  });

  if (!result.id) {
    throw new AppError(httpStatus.CONFLICT, "Tour deletion failed");
  }

  return result;
};

export const tourService = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  getGuideTours,
};
