import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import bcrypt from "bcryptjs"
import config from "../../config";
import { prisma } from "../../helper/prisma";
import { UserRole } from "../../generated/prisma/enums";
import fs from "fs"

const createAdmin = async (req: Request) => {
  if (req.file) {
    const uploadResponse = await fileUploader.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = uploadResponse?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN
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

  const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.guide.email,
        password: hashPassword,
        role: UserRole.GUIDE
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
        bio: req.body.guide?.bio
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

  const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.tourist.email,
        password: hashPassword,
        role: UserRole.TOURIST
      },
    });

    return await tnx.tourist.create({
      data: {
        name: req.body.tourist.name,
        email: req.body.tourist.email,
        profilePhoto: req.body.tourist?.profilePhoto,
        contactNumber: req.body.tourist?.contactNumber,
        address: req.body.tourist?.address
      },
    });
  });

  return result;
};

export const userService = {
    createAdmin,
    createGuide,
    createTourist
}