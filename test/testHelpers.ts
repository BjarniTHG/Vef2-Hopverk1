import jwt from 'jsonwebtoken';
import { app } from '../src/index';

export const generateTestToken = (userId: number, isAdmin: boolean = false): string => {
  return jwt.sign(
    { userId, isAdmin },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
};

export const authRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  token?: string,
  body?: unknown
): Promise<Response> => {
  const req = new Request(`http://localhost${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  return await app.fetch(req);
};

export const formDataRequest = async (
  path: string,
  token?: string,
  formData?: FormData
): Promise<Response> => {
  const req = new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData
  });

  return await app.fetch(req);
};

export const mockData = {
  user: {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword123',
    isAdmin: false,
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  adminUser: {
    id: 2,
    email: 'admin@example.com',
    username: 'admin',
    password: 'hashedpassword456',
    isAdmin: true,
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  champion: {
    id: 'TestChamp',
    key: '0', 
    name: 'Test Champion',
    title: 'the Tester',
    blurb: 'This is a test champion',
    partype: 'None',
    attack: 1,
    defense: 1,
    magic: 1,
    difficulty: 1,
    hp: 100,
    hpperlevel: 10,
    mp: 100,
    mpperlevel: 10,
    movespeed: 330,
    armor: 30,
    armorperlevel: 3,
    spellblock: 30,
    spellblockperlevel: 3,
    attackrange: 150,
    hpregen: 5,
    hpregenperlevel: 0.5,
    mpregen: 5,
    mpregenperlevel: 0.5,
    crit: 0,
    critperlevel: 0,
    attackdamage: 60,
    attackdamageperlevel: 3,
    attackspeedperlevel: 1,
    attackspeed: 0.7,
    imageUrl: 'https://example.com/test.png',
    version: '1.0.0'
  }
};
