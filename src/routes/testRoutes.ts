import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const testRouter = new Hono()

testRouter.get('/items', async (c) => {
  try {
    const items = await prisma.item.findMany({
      take: 5,
      include: {
        tags: true,
        stats: true
      }
    })
    
    return c.json({
      message: 'Items test',
      count: items.length,
      items
    })
  } catch (error) {
    console.error('Error testing items:', error)
    return c.json({ 
      error: 'Test failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export default testRouter
