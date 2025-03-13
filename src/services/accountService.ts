import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import {hashPassword, comparePasswords} from "../utils/hashUtil";

const prisma = new PrismaClient();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

export const changeUsername = async (userId: number, newUsername: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { username: newUsername },
    });
};

export const changePassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string
  ) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Notandi finnst ekki");
    }
    const isValid = await comparePasswords(currentPassword, user.password);
    if (!isValid) {
      throw new Error("Vitlaust lykilorð");
    }
    const newHashedPassword = await hashPassword(newPassword);
    return await prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
  };