import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../helper/prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { searchableFields } from "./user.constants";
import { Prisma } from "../../generated/prisma/client";
import {
  IPaginationParameters,
  normalizePaginationQueryParams,
} from "../../helper/normalizeQueryParams";
import { TUserJwtPayload } from "../../types";
import { addDays, startOfDay } from "date-fns";

const createAdmin = async (req: Request) => {
  if (req.file) {
    const uploadResponse = await fileUploader.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = uploadResponse?.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.bcrypt_salt_round)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });

    return await tnx.admin.create({
      data: {
        name: req.body.admin.name,
        email: req.body.admin.email,
        profilePhoto: req.body.admin?.profilePhoto,
        contactNumber: req.body.admin?.contactNumber,
      },
    });
  });

  return result;
};

const createGuide = async (req: Request) => {
  if (req.file) {
    const uploadResponse = await fileUploader.uploadToCloudinary(req.file);
    req.body.tourist.profilePhoto = uploadResponse?.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.bcrypt_salt_round)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.guide.email,
        password: hashPassword,
        role: UserRole.GUIDE,
      },
    });

    return await tnx.guide.create({
      data: {
        name: req.body.guide.name,
        email: req.body.guide.email,
        profilePhoto: req.body.guide?.profilePhoto,
        contactNumber: req.body.guide?.contactNumber,
        experienceYears: req.body.guide?.experienceYears,
        address: req.body.guide?.address,
        bio: req.body.guide?.bio,
      },
    });
  });

  return result;
};

const createTourist = async (req: Request) => {
  if (req.file) {
    const uploadResponse = await fileUploader.uploadToCloudinary(req.file);
    req.body.tourist.profilePhoto = uploadResponse?.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.bcrypt_salt_round)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.tourist.email,
        password: hashPassword,
        role: UserRole.TOURIST,
      },
    });

    return await tnx.tourist.create({
      data: {
        name: req.body.tourist.name,
        email: req.body.tourist.email,
        profilePhoto: req.body.tourist?.profilePhoto,
        contactNumber: req.body.tourist?.contactNumber,
        address: req.body.tourist?.address,
      },
    });
  });

  return result;
};

const getAllUsers = async (
  paginations: Partial<IPaginationParameters>,
  filters: any
) => {
  const { take, skip, page, sortOrder, sortBy } =
    normalizePaginationQueryParams(paginations);

  const { searchTerm, ...filterOptions } = filters;

  const filterOptionsPairs = Object.entries(filterOptions);

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map((key) => {
        if (key === "name") {
          return {
            OR: [
              {
                admin: { name: { contains: searchTerm, mode: "insensitive" } },
              },
              {
                guide: { name: { contains: searchTerm, mode: "insensitive" } },
              },
              {
                tourist: {
                  name: { contains: searchTerm, mode: "insensitive" },
                },
              },
            ],
          };
        } else {
          return {
            [key]: { contains: searchTerm, mode: "insensitive" },
          };
        }
      }),
    });
  }

  if (filterOptionsPairs.length > 0) {
    andConditions.push({
      AND: filterOptionsPairs.map((eachPair) => ({
        [eachPair[0]]: {
          equals: eachPair[1],
        },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereConditions,
    include: {
      admin: true,
      guide: true,
      tourist: true,
    },
  });

  const sanitized = result.map(({ password, ...rest }) => rest);

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      limit: take,
      page,
      total,
    },
    sanitized,
  };
};

const updateUser = async (payload: any, user: TUserJwtPayload) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: "ACTIVE"
    }
  });

  let updatedRoleData;

  if (isUserExists.role === "ADMIN") {
    updatedRoleData = await prisma.admin.update({
      where: { email: isUserExists.email },
      data: payload,
    });
  } else if (isUserExists.role === "GUIDE") {
    updatedRoleData = await prisma.guide.update({
      where: { email: isUserExists.email },
      data: payload,
    });
  } else if (isUserExists.role === "TOURIST") {
    updatedRoleData = await prisma.tourist.update({
      where: { email: isUserExists.email },
      data: payload,
    });
  }

  return updatedRoleData || {};
};

const softDelete = async (userId: string) => {
  await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.DELETED,
      },
      include: {
        admin: true,
        guide: true,
        tourist: true,
      },
    });

    if (user.role === "ADMIN") {
      await tnx.admin.update({
        where: {
          id: user.admin?.id,
        },
        data: {
          isDeleted: true,
        },
      });
    } else if (user.role === "GUIDE") {
      await tnx.guide.update({
        where: {
          id: user.guide?.id,
        },
        data: {
          isDeleted: true,
        },
      });
    } else {
      await tnx.tourist.update({
        where: {
          id: user.tourist?.id,
        },
        data: {
          isDeleted: true,
        },
      });
    }
  });
};

export const userService = {
  createAdmin,
  createGuide,
  createTourist,
  getAllUsers,
  updateUser,
  softDelete,
};
