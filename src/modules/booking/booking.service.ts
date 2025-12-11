import { BookingStatus } from "../../generated/prisma/enums";
import { prisma } from "../../helper/prisma";
import { TUserJwtPayload } from "../../types";
import { v4 as uuidv4 } from "uuid";

const createBooking = async (
  payload: { tourId: string },
  user: TUserJwtPayload
) => {
  const tourist = await prisma.tourist.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });

  return await prisma.$transaction(async (tnx) => {
    const booking = await tnx.booking.create({
      data: {
        tourId: payload.tourId,
        touristId: tourist.id,
      },
      include: {
        tour: true,
      },
    });

    const transactionId = uuidv4();
    const payment = await tnx.payment.create({
      data: {
        bookingId: booking.id,
        transactionId,
        amount: booking.tour.tourFee,
      },
    });

    return {
      booking,
      payment,
    };
  });
};

const getTouristBookings = async (
  user: TUserJwtPayload,
  status: BookingStatus | null
) => {
  const bookings = await prisma.booking.findMany({
    where: {
      tourist: {
        email: user.email,
      },
      ...(status ? { status } : {}),
    },
    include: {
      tour: {
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
        },
      },
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return bookings;
};

const confirmBooking = async (bookingId: string, user: TUserJwtPayload) => {
  const result = await prisma.booking.updateMany({
    where: {
      id: bookingId,
      tour: {
        guide: {
          email: user.email,
        },
      },
    },
    data: {
      status: BookingStatus.CONFIRMED,
    },
  });

  return result;
};

const cancelBooking = async (bookingId: string, user: TUserJwtPayload) => {
  const result = await prisma.booking.updateMany({
    where: {
      id: bookingId,
      OR: [
        {
          tour: {
            guide: {
              email: user.email,
            },
          },
        },
        {
          tourist: {
            email: user.email,
          },
        },
      ],
    },
    data: {
      status: BookingStatus.CANCELLED,
    },
  });

  return result;
};

const completeBooking = async (bookingIds: string[], user: TUserJwtPayload) => {
  const result = await prisma.booking.updateMany({
    where: {
      id: {
        in: bookingIds
      },
      tour: {
        guide: {
          email: user.email,
        },
      },
    },
    data: {
      status: BookingStatus.COMPLETED
    },
  });

  return result;
}

export const bookingService = {
  createBooking,
  getTouristBookings,
  confirmBooking,
  cancelBooking,
  completeBooking
};
