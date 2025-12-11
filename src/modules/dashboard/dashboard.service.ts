import { addDays, startOfDay } from "date-fns";
import { TUserJwtPayload } from "../../types";
import { prisma } from "../../helper/prisma";
import { BookingStatus, PaymentStatus } from "../../generated/prisma/enums";

const adminDashboardInfo = async (user: TUserJwtPayload) => {
  const adminEmail = user.email;

  const admin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    throw new Error("Admin account not found.");
  }

  const today = startOfDay(new Date());
  const next7Days = addDays(today, 7);

  // 1️⃣ Total Users Overview
  const [totalGuides, totalTourists, totalAdmins] = await Promise.all([
    prisma.guide.count(),
    prisma.tourist.count(),
    prisma.admin.count(),
  ]);

  // 2️⃣ Total Tours & Total Bookings
  const [totalTours, totalBookings] = await Promise.all([
    prisma.tour.count(),
    prisma.booking.count(),
  ]);

  // 3️⃣ Upcoming Tours (next 7 days)
  const upcomingTours = await prisma.tour.findMany({
    where: {
      tourDate: {
        gte: today,
        lte: next7Days,
      },
    },
    orderBy: { tourDate: "asc" },
    include: {
      guide: {
        select: { name: true, email: true },
      },
    },
  });

  // 4️⃣ Recent Bookings Activity
  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      tourist: { select: { name: true, email: true } },
      tour: { select: { title: true, tourDate: true } },
    },
  });

  return {
    users: {
      guides: totalGuides,
      tourists: totalTourists,
      admins: totalAdmins,
    },
    counts: {
      tours: totalTours,
      bookings: totalBookings,
    },
    upcomingTours,
    recentBookings,
  };
};

const guideDashboardInfo = async (user: TUserJwtPayload) => {
  const guideEmail = user.email;

  const guide = await prisma.guide.findUnique({
    where: { email: guideEmail },
  });

  if (!guide) {
    throw new Error("Guide account not found.");
  }

  const today = startOfDay(new Date());

  // 1️⃣ Upcoming Tours
  const upcomingTours = await prisma.tour.findMany({
    where: {
      guideId: guide.id,
      tourDate: {
        gte: today,
      },
    },
    orderBy: { tourDate: "asc" },
  });

  // 2️⃣ Average Rating + 5 Latest Reviews
  const latestReviews = await prisma.review.findMany({
    where: { guideId: guide.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      tourist: {
        select: { name: true, email: true },
      },
    },
  });

  // 3️⃣ Total Tours Completed
  const totalCompletedTours = await prisma.tour.count({
    where: {
      guideId: guide.id,
      tourDate: { lt: today },
    },
  });

  return {
    upcomingTours,
    rating: guide.avrgRating,
    latestReviews,
    completedTours: totalCompletedTours,
  };
};

const touristDashboardInfo = async (user: TUserJwtPayload) => {
  const touristEmail = user.email;

  const tourist = await prisma.tourist.findUnique({
    where: { email: touristEmail },
  });

  if (!tourist) {
    throw new Error("Tourist account not found.");
  }

  const today = startOfDay(new Date());

  // 1️⃣ Upcoming Bookings
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      touristId: tourist.id,
      tour: { tourDate: { gte: today } },
    },
    orderBy: { tour: { tourDate: "asc" } },
    include: {
      tour: {
        select: {
          id: true,
          title: true,
          tourDate: true,
          guide: { select: { name: true, email: true } },
        },
      },
    },
  });

  // 2️⃣ Completed Tours (CONFIRMED bookings only)
  const completedTours = await prisma.booking.findMany({
    where: {
      touristId: tourist.id,
      status: BookingStatus.CONFIRMED,
      tour: { tourDate: { lt: today } },
    },
    orderBy: { tour: { tourDate: "desc" } },
    include: {
      tour: {
        select: {
          id: true,
          title: true,
          tourDate: true,
          guide: { select: { name: true } },
        },
      },
    },
  });

  // 3️⃣ Pending Payments
  const pendingPayments = await prisma.booking.findMany({
    where: {
      touristId: tourist.id,
      paymentStatus: PaymentStatus.UNPAID,
    },
    orderBy: { createdAt: "desc" },
    include: {
      tour: { select: { id: true, title: true, tourDate: true } },
    },
  });

  // 4️⃣ Booking History Summary (Latest 5)
  const recentBookings = await prisma.booking.findMany({
    where: { touristId: tourist.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      tour: { select: { id: true, title: true, tourDate: true } },
    },
  });

  return {
    upcomingBookings,
    completedTours,
    pendingPayments,
    recentBookings,
  };
};

export const dashboardService = {
  adminDashboardInfo,
  guideDashboardInfo,
  touristDashboardInfo
};
