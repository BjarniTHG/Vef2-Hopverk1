import { PrismaClient } from '@prisma/client'
import { ChampionData, Champion as ChampionType } from '../types/champion'
import { fetchChampionsData, fetchChampionDetails, getChampionImageUrl, getAbilityImageUrl, getPassiveImageUrl } from '../utils/api'

const prisma = new PrismaClient()

export const syncAllChampions = async (): Promise<void> => {
  try {
    const championsData: ChampionData = await fetchChampionsData()
    const version = championsData.version 
    
    console.log(`Syncing ${Object.keys(championsData.data).length} champions...`)
    
    for (const champId of Object.keys(championsData.data)) {
      await syncChampionDetails(champId, version)
    }
    
    console.log('Champion sync completed successfully')
  } catch (error) {
    console.error('Error syncing champions:', error)
    throw error
  }
}
export const syncChampionDetails = async (championId: string, version: string): Promise<void> => {
  try {
    const championDetails = await fetchChampionDetails(championId)
    
    await prisma.champion.upsert({
      where: { id: championDetails.id },
      update: {
        key: championDetails.key,
        name: championDetails.name,
        title: championDetails.title,
        blurb: championDetails.blurb,
        partype: championDetails.partype,
        attack: championDetails.info.attack,
        defense: championDetails.info.defense,
        magic: championDetails.info.magic,
        difficulty: championDetails.info.difficulty,
        hp: championDetails.stats.hp,
        hpperlevel: championDetails.stats.hpperlevel,
        mp: championDetails.stats.mp,
        mpperlevel: championDetails.stats.mpperlevel,
        movespeed: championDetails.stats.movespeed,
        armor: championDetails.stats.armor,
        armorperlevel: championDetails.stats.armorperlevel,
        spellblock: championDetails.stats.spellblock,
        spellblockperlevel: championDetails.stats.spellblockperlevel,
        attackrange: championDetails.stats.attackrange,
        hpregen: championDetails.stats.hpregen,
        hpregenperlevel: championDetails.stats.hpregenperlevel,
        mpregen: championDetails.stats.mpregen,
        mpregenperlevel: championDetails.stats.mpregenperlevel,
        crit: championDetails.stats.crit,
        critperlevel: championDetails.stats.critperlevel,
        attackdamage: championDetails.stats.attackdamage,
        attackdamageperlevel: championDetails.stats.attackdamageperlevel,
        attackspeedperlevel: championDetails.stats.attackspeedperlevel,
        attackspeed: championDetails.stats.attackspeed,
        imageUrl: getChampionImageUrl(championDetails.image.full),
        version: version, 
      },
      create: {
        id: championDetails.id,
        key: championDetails.key,
        name: championDetails.name,
        title: championDetails.title,
        blurb: championDetails.blurb,
        partype: championDetails.partype,
        attack: championDetails.info.attack,
        defense: championDetails.info.defense,
        magic: championDetails.info.magic,
        difficulty: championDetails.info.difficulty,
        hp: championDetails.stats.hp,
        hpperlevel: championDetails.stats.hpperlevel,
        mp: championDetails.stats.mp,
        mpperlevel: championDetails.stats.mpperlevel,
        movespeed: championDetails.stats.movespeed,
        armor: championDetails.stats.armor,
        armorperlevel: championDetails.stats.armorperlevel,
        spellblock: championDetails.stats.spellblock,
        spellblockperlevel: championDetails.stats.spellblockperlevel,
        attackrange: championDetails.stats.attackrange,
        hpregen: championDetails.stats.hpregen,
        hpregenperlevel: championDetails.stats.hpregenperlevel,
        mpregen: championDetails.stats.mpregen,
        mpregenperlevel: championDetails.stats.mpregenperlevel,
        crit: championDetails.stats.crit,
        critperlevel: championDetails.stats.critperlevel,
        attackdamage: championDetails.stats.attackdamage,
        attackdamageperlevel: championDetails.stats.attackdamageperlevel,
        attackspeedperlevel: championDetails.stats.attackspeedperlevel,
        attackspeed: championDetails.stats.attackspeed,
        imageUrl: getChampionImageUrl(championDetails.image.full),
        version: version, 
      }
    })
    
    await syncChampionTags(championDetails)
    
    await syncChampionAbilities(championDetails)
    
    await syncChampionSkins(championDetails)
    
    console.log(`Champion ${championDetails.name} synced successfully`)
  } catch (error) {
    console.error(`Error syncing champion ${championId}:`, error)
    throw error
  }
}
export const syncChampionTags = async (championDetails: ChampionType): Promise<void> => {
  await prisma.championTag.deleteMany({
    where: { championId: championDetails.id }
  })
  
  for (const tag of championDetails.tags) {
    await prisma.championTag.create({
      data: {
        name: tag,
        championId: championDetails.id
      }
    })
  }
}

export const syncChampionAbilities = async (championDetails: ChampionType): Promise<void> => {
  await prisma.ability.deleteMany({
    where: { championId: championDetails.id }
  })
  
  await prisma.ability.create({
    data: {
      championId: championDetails.id,
      name: championDetails.passive.name,
      description: championDetails.passive.description,
      abilityType: 'passive',
      slot: null,
      imageUrl: getPassiveImageUrl(championDetails.passive.image.full),
    }
  })

  const slots = ['Q', 'W', 'E', 'R']
  for (let i = 0; i < championDetails.spells.length; i++) {
    const spell = championDetails.spells[i]
    await prisma.ability.create({
      data: {
        championId: championDetails.id,
        name: spell.name,
        description: spell.description,
        tooltip: spell.tooltip,
        abilityType: 'spell',
        slot: slots[i],
        cooldownBurn: spell.cooldownBurn,
        costBurn: spell.costBurn,
        rangeBurn: spell.rangeBurn,
        imageUrl: getAbilityImageUrl(spell.image.full),
      }
    })
  }
}

export const syncChampionSkins = async (championDetails: ChampionType): Promise<void> => {
  await prisma.skin.deleteMany({
    where: { championId: championDetails.id }
  })
  
  for (const skin of championDetails.skins) {
    await prisma.skin.create({
      data: {
        championId: championDetails.id,
        skinId: skin.id,
        num: skin.num,
        name: skin.name,
        chromas: skin.chromas,
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championDetails.id}_${skin.num}.jpg`
      }
    })
  }
}

export const getAllChampions = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit
    const [champions, totalCount] = await Promise.all([
        prisma.champion.findMany({
            skip,
            take: limit,
            include: {
                tags: true
            },
            orderBy: {
                name: 'asc'
            }
        }),
        prisma.champion.count()
    ])

    return {
        data: champions,
        pagination: {
            total: totalCount,
            pages: Math.ceil(totalCount / limit),
            page,
            limit
        }
    }
}

export const getChampionById = async (id: string) => {
    const champion = await prisma.champion.findUnique({
      where: { id },
      include: {
        tags: true,
        abilities: true,
        skins: true
      }
    });
    
    if (!champion) {
      return null;
    }
    
    return champion;
  };
  