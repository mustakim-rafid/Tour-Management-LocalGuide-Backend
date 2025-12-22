import { prisma } from "../../helper/prisma";

const stats = async () => {
  const [totalGuides, totalTourists] = await Promise.all([
    prisma.guide.count(),
    prisma.tourist.count(),
  ]);

  const totalTours = await prisma.tour.count();

  return {
    users: {
      guides: totalGuides,
      tourists: totalTourists,
    },
    counts: {
      tours: totalTours,
    },
  };
};

export const homeService = {
    stats
}
