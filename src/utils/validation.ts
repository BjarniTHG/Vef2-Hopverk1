import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateUsernameSchema = z.object({
  userId: z.number().int().positive(),
  newUsername: z.string().min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
});

export const updatePasswordSchema = z.object({
  userId: z.number().int().positive(),
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const favoriteChampionSchema = z.object({
  championId: z.string().min(1, 'Champion ID is required')
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required')
    .max(1000, 'Comment cannot exceed 1000 characters'),
  championId: z.string().min(1, 'Champion ID is required')
});
