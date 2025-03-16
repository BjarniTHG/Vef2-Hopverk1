import { authRequest, generateTestToken, mockData } from './testHelpers';
import { PrismaClient } from '@prisma/client';
import './mockMiddleware';

import './setup';
import * as championService from '../src/services/championService';

jest.mock('../src/services/championService');

describe('Champion Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /champions', () => {
    it('should return paginated champions', async () => {
      const prisma = new PrismaClient();
      (prisma.champion.findMany as jest.Mock).mockResolvedValue([mockData.champion]);
      (prisma.champion.count as jest.Mock).mockResolvedValue(1);
      
      const res = await authRequest('GET', '/champions');
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
    });
  });

  describe('POST /champions/sync', () => {
    it('should require admin authentication', async () => {
      const res = await authRequest('POST', '/champions/sync');
      expect(res.status).toBe(401);
    });

    it('should sync champions when admin authenticated', async () => {
      const adminToken = generateTestToken(2, true);
      
      (championService.syncAllChampions as jest.Mock).mockResolvedValue(undefined);
      
      const res = await authRequest('POST', '/champions/sync', adminToken);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toHaveProperty('message', 'Champions sync completed successfully');
    });
  });
});
