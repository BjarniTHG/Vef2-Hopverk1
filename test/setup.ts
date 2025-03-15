import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { v2 as cloudinary } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    champion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn()
    },
    championTag: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    ability: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    skin: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    item: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    itemTag: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    itemStat: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    itemBuildPath: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    favoriteChampion: {
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn()
    },
    comment: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    $disconnect: jest.fn()
  };
  
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) => {
        return {
          end: (_buffer: Buffer) => {
            callback(null, {
              public_id: 'test-id',
              secure_url: 'https://test-cloudinary.com/image.jpg'
            });
          }
        };
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockImplementation((token) => {
    if (token === 'invalid-token') throw new Error('Invalid token');
    
    if (token && typeof token === 'string' && token.includes(':')) {
      const [userId, isAdmin] = token.split(':');
      return { userId: parseInt(userId), isAdmin: isAdmin === 'true' };
    }
    
    return { userId: 1 };
  })
}));

jest.mock('../src/services/authService', () => {
    return {
      registerUser: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        username: 'test',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      loginUser: jest.fn().mockResolvedValue({
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'test',
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'test-token'
      }),
      createAdminUser: jest.fn().mockResolvedValue(undefined)
    };
  });
  

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('test-salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockImplementation((password, _hash: string) => {
    return Promise.resolve(password === 'correct-password' || password === 'password123');
  })
}));

global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('champion.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        type: 'champion',
        format: 'standAloneComplex',
        version: '15.5.1',
        data: {
          Aatrox: {
            id: 'Aatrox',
            key: '266',
            name: 'Aatrox',
            title: 'the Darkin Blade',
            tags: ['Fighter', 'Tank'],
            image: { full: 'Aatrox.png' },
            info: { attack: 8, defense: 4, magic: 3, difficulty: 4 },
            stats: {
              hp: 580, hpperlevel: 90, mp: 0, mpperlevel: 0,
              movespeed: 345, armor: 38, armorperlevel: 3.25,
              spellblock: 32, spellblockperlevel: 1.25, attackrange: 175,
              hpregen: 3, hpregenperlevel: 1, mpregen: 0, mpregenperlevel: 0,
              crit: 0, critperlevel: 0, attackdamage: 60, attackdamageperlevel: 5,
              attackspeedperlevel: 2.5, attackspeed: 0.651
            }
          }
        }
      })
    });
  }
  
  if (url.includes('champion/Aatrox.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        type: 'champion',
        format: 'standAloneComplex',
        version: '15.5.1',
        data: {
          Aatrox: {
            id: 'Aatrox',
            key: '266',
            name: 'Aatrox',
            title: 'the Darkin Blade',
            tags: ['Fighter', 'Tank'],
            image: { full: 'Aatrox.png' },
            info: { attack: 8, defense: 4, magic: 3, difficulty: 4 },
            stats: {
              hp: 580, hpperlevel: 90, mp: 0, mpperlevel: 0,
              movespeed: 345, armor: 38, armorperlevel: 3.25,
              spellblock: 32, spellblockperlevel: 1.25, attackrange: 175,
              hpregen: 3, hpregenperlevel: 1, mpregen: 0, mpregenperlevel: 0,
              crit: 0, critperlevel: 0, attackdamage: 60, attackdamageperlevel: 5,
              attackspeedperlevel: 2.5, attackspeed: 0.651
            },
            spells: [
              {
                id: 'AatroxQ',
                name: 'The Darkin Blade',
                description: 'Aatrox slams his greatsword...',
                tooltip: 'Aatrox slams his greatsword...',
                leveltip: { label: [], effect: [] },
                maxrank: 5,
                cooldown: [14, 13, 12, 11, 10],
                cooldownBurn: '14/13/12/11/10',
                cost: [0, 0, 0, 0, 0],
                costBurn: '0',
                datavalues: {},
                effect: [null, [], [], [], []],
                effectBurn: [null, '', '', '', ''],
                vars: [],
                costType: 'No Cost',
                maxammo: '-1',
                range: [25000, 25000, 25000, 25000, 25000],
                rangeBurn: '25000',
                image: { full: 'AatroxQ.png' },
                resource: 'No Cost'
              }
            ],
            passive: {
              name: 'Deathbringer Stance',
              description: 'Periodically, Aatrox empowers his next attack...',
              image: { full: 'Aatrox_Passive.png' }
            },
            skins: [
              { id: '266000', num: 0, name: 'default', chromas: false }
            ],
            version: '15.5.1'
          }
        }
      })
    });
  }
  
  if (url.includes('item.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        type: 'item',
        version: '15.5.1',
        data: {
          '1001': {
            name: 'Test Item',
            description: 'This is a test item',
            colloq: 'test',
            plaintext: 'Test item for mocking',
            image: { full: 'test_item.png' },
            gold: {
              base: 300,
              purchasable: true,
              total: 300,
              sell: 210
            },
            tags: ['Test'],
            maps: { '11': true, '12': true },
            stats: { FlatMovementSpeedMod: 25 }
          }
        }
      })
    });
  }

  return Promise.resolve({
    ok: false,
    statusText: 'Not Found'
  });
});

jest.setTimeout(30000);

afterAll(async () => {
  jest.clearAllMocks();
  
  jest.useRealTimers();
  
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

