import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePasswords } from "../utils/hashUtil";

const prisma = new PrismaClient();

export const registerUser = async (email: string, password: string) => {
    const hashedPassword = await hashPassword(password);
    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword 
        }
    });
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (user && await comparePasswords(password, user.password)) {
        return user;
    }
    throw new Error('Notendanafn eða lykilorð er ekki rétt');
};