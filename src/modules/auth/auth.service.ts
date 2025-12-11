import bcrypt from "bcryptjs";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { generateToken, verifyToken } from "../../helper/jwt";
import config from "../../config";
import { prisma } from "../../helper/prisma";
import { UserStatus } from "../../generated/prisma/enums";
import { TUserJwtPayload } from "../../types";

const login = async (payload: { email: string; password: string }) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No user found or incorrect email"
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    isUserExists.password
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const jwtPayload = {
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.access_token_secret as string,
    config.jwt.access_token_expiry as string
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expiry as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, "Token is missing");
  }
  const decodedToken = verifyToken(
    token,
    config.jwt.access_token_secret as string
  );

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedToken.email,
      status: UserStatus.ACTIVE,
    },
    include:
      decodedToken.role === "ADMIN"
        ? { admin: true }
        : decodedToken.role === "GUIDE"
        ? { guide: true }
        : { tourist: true },
  });

  return user
};

const changePassword = async (user: TUserJwtPayload, oldPassword: string, newPassword: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE
    }
  })

  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, userData.password)

  if (!isOldPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect")
  }

  const hashPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_round))

  const userWithNewPassword = await prisma.user.update({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE
    },
    data: {
      password: hashPassword
    }
  })

  return userWithNewPassword
}

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken || refreshToken.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Refresh token not found");
  }

  let decodedToken

  try {
    decodedToken = verifyToken(refreshToken, config.jwt.refresh_token_secret as string)
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
  }

  if (!decodedToken || !decodedToken.email) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid request, Login again");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
        email: decodedToken.email,
        status: "ACTIVE"
    }
  })

  const accessToken = generateToken({
    email: userData.email,
    role: userData.role
  }, config.jwt.access_token_secret as string, config.jwt.access_token_expiry as string)

  return {
    accessToken,
  };
};



export const authService = {
  login,
  getMe,
  changePassword,
  refreshToken
};
