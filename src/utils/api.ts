const LOL_VERSION = '15.5.1';
const BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${LOL_VERSION}/data/en_US`;
const IMAGE_BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${LOL_VERSION}/img`;
import { ItemsData } from "../types/item";
import { ChampionData, Champion } from "../types/champion";

export const fetchItemsData = async (): Promise<ItemsData> => {
  const response = await fetch(`${BASE_URL}/item.json`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch item data: ${response.statusText}`);
  }
  
  return response.json();
};

export const getItemImageUrl = (imageName: string): string => {
  return `${IMAGE_BASE_URL}/item/${imageName}`;
};

export const fetchChampionsData = async (): Promise<ChampionData> => {
    const response = await fetch(`${BASE_URL}/champion.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch champion data: ${response.statusText}`);
    }
    
    return response.json();
  };
  
  export const fetchChampionDetails = async (championId: string): Promise<Champion> => {
    const response = await fetch(`${BASE_URL}/champion/${championId}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch champion details: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data[championId];
  };
  
  export const getChampionImageUrl = (imageName: string): string => {
    return `${IMAGE_BASE_URL}/champion/${imageName}`;
  };
  
  export const getAbilityImageUrl = (imageName: string): string => {
    return `${IMAGE_BASE_URL}/spell/${imageName}`;
  };
  
  export const getPassiveImageUrl = (imageName: string): string => {
    return `${IMAGE_BASE_URL}/passive/${imageName}`;
  };