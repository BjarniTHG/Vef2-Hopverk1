// Mock for championService.ts
jest.mock('../src/services/championService', () => ({
    getAllChampions: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'Aatrox',
          name: 'Aatrox',
          title: 'the Darkin Blade',
          tags: [{ name: 'Fighter' }, { name: 'Tank' }]
        }
      ],
      pagination: {
        total: 1,
        pages: 1,
        page: 1,
        limit: 20
      }
    }),
    getChampionById: jest.fn().mockImplementation((id) => {
      if (id === 'Aatrox') {
        return Promise.resolve({
          id: 'Aatrox',
          name: 'Aatrox',
          title: 'the Darkin Blade',
          tags: [{ name: 'Fighter' }, { name: 'Tank' }],
          abilities: [],
          skins: []
        });
      }
      return Promise.resolve(null);
    }),
    syncAllChampions: jest.fn().mockResolvedValue(undefined)
  }));
  