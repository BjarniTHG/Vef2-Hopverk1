import { PrismaClient } from '@prisma/client'
import { ItemsData, ItemData } from '../types/item'
import { fetchItemsData, getItemImageUrl } from '../utils/api'

const prisma = new PrismaClient()

export const syncAllItems = async (): Promise<void> => {
  try {
    console.log('Starting items sync...')
    const itemsData: ItemsData = await fetchItemsData()
    
    console.log(`Syncing ${Object.keys(itemsData.data).length} items...`)
    
    for (const [itemId, itemData] of Object.entries(itemsData.data)) {
      await syncItem(itemId, itemData, itemsData.version)
    }
    
    await syncBuildPaths(itemsData)
    
    console.log('Items sync completed successfully')
  } catch (error) {
    console.error('Error syncing items:', error)
    throw error
  }
}

const syncItem = async (itemId: string, itemData: ItemData, version: string): Promise<void> => {
  try {
    console.log(`Processing item: ${itemData.name} (${itemId})`)
    
    await prisma.item.upsert({
      where: { id: itemId },
      update: {
        name: itemData.name,
        description: itemData.description,
        plaintext: itemData.plaintext || null,
        colloq: itemData.colloq || null,
        goldBase: itemData.gold.base,
        goldTotal: itemData.gold.total, 
        goldSell: itemData.gold.sell,
        isPurchasable: itemData.gold.purchasable,
        imageUrl: getItemImageUrl(itemData.image.full),
        maps: itemData.maps,
        version: version
      },
      create: {
        id: itemId,
        name: itemData.name,
        description: itemData.description,
        plaintext: itemData.plaintext || null,
        colloq: itemData.colloq || null,
        goldBase: itemData.gold.base,
        goldTotal: itemData.gold.total,
        goldSell: itemData.gold.sell,
        isPurchasable: itemData.gold.purchasable,
        imageUrl: getItemImageUrl(itemData.image.full),
        maps: itemData.maps,
        version: version
      }
    })
    
    await syncItemStats(itemId, itemData.stats)
    
    await syncItemTags(itemId, itemData.tags)
    
  } catch (error) {
    console.error(`Error syncing item ${itemId}:`, error)
    throw error
  }
}

const syncItemStats = async (itemId: string, stats: Record<string, number>): Promise<void> => {
  await prisma.itemStat.deleteMany({
    where: { itemId }
  })
  
  for (const [statName, value] of Object.entries(stats)) {
    if (value !== 0) {
      await prisma.itemStat.create({
        data: {
          itemId,
          name: statName,
          value
        }
      })
    }
  }
}

const syncItemTags = async (itemId: string, tags: string[]): Promise<void> => {
  await prisma.itemTag.deleteMany({
    where: { itemId }
  })
  
  for (const tag of tags) {
    await prisma.itemTag.create({
      data: {
        itemId,
        name: tag
      }
    })
  }
}

const syncBuildPaths = async (itemsData: ItemsData): Promise<void> => {
  await prisma.itemBuildPath.deleteMany({})
  
  for (const [itemId, itemData] of Object.entries(itemsData.data)) {
    if (itemData.from && itemData.from.length > 0) {
      for (const fromItemId of itemData.from) {
        try {
          await prisma.itemBuildPath.create({
            data: {
              fromItemId,
              toItemId: itemId
            }
          })
        } catch (error) {
          console.warn(`Couldn't create build path from ${fromItemId} to ${itemId}:`, error)
        }
      }
    }
  }
}

export const getAllItems = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  
  const [items, totalCount] = await Promise.all([
    prisma.item.findMany({
      skip,
      take: limit,
      include: {
        tags: true,
        stats: true
      }
    }),
    prisma.item.count()
  ])
  
  return {
    data: items,
    pagination: {
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      page,
      limit
    }
  }
}

export const getItemById = async (id: string) => {
  return prisma.item.findUnique({
    where: { id },
    include: {
      tags: true,
      stats: true,
      builds_from: {
        include: {
          fromItem: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      },
      builds_into: {
        include: {
          toItem: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    }
  })
}
