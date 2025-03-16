import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePasswords } from "../utils/hashUtil";

const prisma = new PrismaClient();

export const registerUser = async (email: string, password: string) => {
    const hashedPassword = await hashPassword(password);
    return await prisma.user.create({
        data: {
            email,

            passwordHash: hashedPassword,
            username: email.split('@')[0]

        }
    });
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user && await comparePasswords(password, user.passwordHash)) {
        return user;
    }
    throw new Error('Notendanafn eða lykilorð er ekki rétt');
};

export const createAdminUser = async () => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'AdminPassword123';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });
    
    if (!existingAdmin) {
        const hashedPassword = await hashPassword(adminPassword);
        await prisma.user.create({
            data: {
                email: adminEmail,
                username: 'admin',
                passwordHash: hashedPassword,
                isAdmin: true
            }
        });
        console.log('Admin aðgangur stofnaður');
    }
};
