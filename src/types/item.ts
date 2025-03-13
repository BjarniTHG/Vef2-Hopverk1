export interface ItemsData {
    type: string;
    version: string;
    basic: {
      name: string;
      rune: {
        isrune: boolean;
        tier: number;
        type: string;
      };
      gold: {
        base: number;
        total: number;
        sell: number;
        purchasable: boolean;
      };
      group: string;
      description: string;
      colloq: string;
      plaintext: string;
      consumed: boolean;
      stacks: number;
      depth: number;
      consumeOnFull: boolean;
      from: string[];
      into: string[];
      specialRecipe: number;
      inStore: boolean;
      hideFromAll: boolean;
      requiredChampion: string;
      requiredAlly: string;
      stats: Record<string, number>;
      tags: string[];
      maps: Record<string, boolean>;
    };
    data: Record<string, ItemData>;
  }
  
  export interface ItemData {
    name: string;
    description: string;
    colloq: string;
    plaintext: string;
    from?: string[];
    into?: string[];
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
    gold: {
      base: number;
      purchasable: boolean;
      total: number;
      sell: number;
    };
    tags: string[];
    maps: Record<string, boolean>;
    stats: Record<string, number>;
    depth?: number;
  }
  
  export interface ItemResponse {
    id: string;
    name: string;
    description: string;
    plaintext?: string;
    goldTotal: number;
    goldSell: number;
    isPurchasable: boolean;
    imageUrl: string;
    tags: string[];
    stats: {
      name: string;
      value: number;
    }[];
    buildsFrom: string[];
    buildsInto: string[];
    maps: string[];
    version: string;
  }
  