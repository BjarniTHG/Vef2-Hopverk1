import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

export const authenticate = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Aðgangi hafnað - token vantar' }, 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return c.json({ error: 'Notandi finnst ekki' }, 401);
    }
    
    c.set('user', user);
    
    await next();
  } catch{
    return c.json({ error: 'Ógilt eða útrunnið token' }, 401);
  }
};

export const isAdmin = async (c: Context, next: Next) => {
  try {
    const user = c.get('user');
    
    if (!user || !user.isAdmin) {
      return c.json({ error: 'Aðgangi hafnað - admin réttindi þarf' }, 403);
    }
    
    await next();
  } catch {
    return c.json({ error: 'Villa við að staðfesta admin réttindi' }, 500);
  }
};
