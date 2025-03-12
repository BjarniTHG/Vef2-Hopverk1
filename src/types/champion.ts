export interface ChampionData {
    type: string;
    format: string;
    version: string;
    data: Record<string, Champion>;
  }
  
  export interface Champion {
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    lore: string;
    allytips: string[];
    enemytips: string[];
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
    tags: string[];
    partype: string;
    info: {
      attack: number;
      defense: number;
      magic: number;
      difficulty: number;
    };
    stats: {
      hp: number;
      hpperlevel: number;
      mp: number;
      mpperlevel: number;
      movespeed: number;
      armor: number;
      armorperlevel: number;
      spellblock: number;
      spellblockperlevel: number;
      attackrange: number;
      hpregen: number;
      hpregenperlevel: number;
      mpregen: number;
      mpregenperlevel: number;
      crit: number;
      critperlevel: number;
      attackdamage: number;
      attackdamageperlevel: number;
      attackspeedperlevel: number;
      attackspeed: number;
    };
    version: string;
    spells: Array<{
      id: string;
      name: string;
      description: string;
      tooltip: string;
      leveltip: {
        label: string[];
        effect: string[];
      };
      maxrank: number;
      cooldown: number[];
      cooldownBurn: string;
      cost: number[];
      costBurn: string;
      datavalues: Record<string, unknown>;
      effect: Array<number[] | null>;
      effectBurn: Array<string | null>;
      vars: unknown[];
      costType: string;
      maxammo: string;
      range: number[];
      rangeBurn: string;
      image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
      };
      resource: string;
    }>;
    passive: {
      name: string;
      description: string;
      image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
      };
    };
    skins: Array<{
      id: string;
      num: number;
      name: string;
      chromas: boolean;
    }>;
  }  
  export interface CreateCommentDto {
    content: string;
    championId: string;
  }
  
  export interface ChampionResponse {
    id: string;
    name: string;
    title: string;
    blurb: string;
    imageUrl: string;
    tags: string[];
    stats: {
      attack: number;
      defense: number;
      magic: number;
      difficulty: number;
      hp: number;
      movespeed: number;
      armor: number;
      spellblock: number;
      attackrange: number;
      attackdamage: number;
      attackspeed: number;
    };
    abilities: AbilityResponse[];
    skins: SkinResponse[];
  }
  
  export interface AbilityResponse {
    id: number;
    name: string;
    description: string;
    abilityType: string; // "passive" eða "spell"
    slot: string | null; // "Q", "W", "E", "R" eða null fyrir passive
    cooldownBurn?: string;
    costBurn?: string;
    rangeBurn?: string;
    imageUrl: string;
  }
  
  export interface SkinResponse {
    id: number;
    name: string;
    num: number;
    chromas: boolean;
    imageUrl: string;
  }
  