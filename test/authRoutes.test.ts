import { app } from '../src/index';
import * as authService from '../src/services/authService';
import './mockMiddleware';

jest.mock('../src/services/authService');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /routes/register', () => {
    it('should register a new user', async () => {
      (authService.registerUser as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'new@example.com',
        username: 'new',
        password: 'hashed-password',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const req = new Request('http://localhost/routes/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'new@example.com',
          password: 'password123'
        })
      });

      const res = await app.fetch(req);
      console.log('Register response status:', res.status);
      const data = await res.json();
      console.log('Register response body:', data);
      
      expect(res.status).toBe(200);
      expect(data).toHaveProperty('message', 'Aðgangur stofnaður');
      expect(data).toHaveProperty('user');
    });
  });

  describe('POST /routes/login', () => {
    it('should login an existing user', async () => {
      (authService.loginUser as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        username: 'test',
        password: 'hashed-password',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const req = new Request('http://localhost/routes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      const res = await app.fetch(req);
      console.log('Login response status:', res.status);
      const data = await res.json();
      console.log('Login response body:', data);
      
      expect(res.status).toBe(200);
      expect(data).toHaveProperty('message', 'Notandi skráður inn');
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('token');
    });
  });
});
