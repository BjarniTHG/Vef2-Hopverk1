import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

interface User {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const mockUsers = {
  user: {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    isAdmin: false,
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  adminUser: {
    id: 2,
    email: 'admin@example.com',
    username: 'admin',
    isAdmin: true,
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

jest.mock('../src/middleware/auth', () => {
  const originalModule = jest.requireActual('../src/middleware/auth');
  
  return {
    ...originalModule,
    
    authenticate: jest.fn().mockImplementation((c, next) => {
      const authHeader = c.req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Aðgangi hafnað - token vantar' }, 401);
      }
      
      const token = authHeader.split(' ')[1];
      
      try {
        if (token === 'invalid-token') {
          throw new Error('Invalid token');
        }
        
        let payload: { userId: number; isAdmin: boolean };
        
        if (token.includes(':')) {
          const [userIdStr, isAdminStr] = token.split(':');
          payload = { 
            userId: parseInt(userIdStr), 
            isAdmin: isAdminStr === 'true' 
          };
        } else {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-key');
          payload = { 
            userId: (decodedToken as { userId: number }).userId,
            isAdmin: (decodedToken as { isAdmin?: boolean }).isAdmin || false 
          };
        }
        
        const userData = payload.isAdmin ? mockUsers.adminUser : mockUsers.user;
        
        c.set('user', {
          id: payload.userId || userData.id,
          email: userData.email,
          username: userData.username,
          isAdmin: payload.isAdmin,
          profileImageUrl: userData.profileImageUrl,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        });
        
        return next();
      } catch {
        return c.json({ error: 'Ógilt eða útrunnið token' }, 401);
      }
    }),

    isAdmin: jest.fn().mockImplementation((c, next) => {
      const user = c.get('user');
      
      if (!user || !user.isAdmin) {
        return c.json({ error: 'Aðgangi hafnað - admin réttindi þarf' }, 403);
      }
      
      return next();
    })
  };
});

jest.mock('../src/middleware/rateLimiter', () => ({
  rateLimiter: () => async (c: Context, next: Next) => {
    return next();
  }
}));
