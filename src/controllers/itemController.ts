import { Context } from 'hono'
import * as itemService from '../services/itemService'

export const getAllItems = async (c: Context) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    
    const result = await itemService.getAllItems(page, limit)
    return c.json(result)
  } catch (error) {
    console.error('Error fetching items:', error)
    return c.json({ error: 'Failed to fetch items' }, 500)
  }
}

export const getItemById = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const item = await itemService.getItemById(id)
    
    if (!item) {
      return c.json({ error: 'Item not found' }, 404)
    }
    
    return c.json(item)
  } catch (error) {
    console.error(`Error fetching item with ID ${c.req.param('id')}:`, error)
    return c.json({ error: 'Failed to fetch item' }, 500)
  }
}

export const syncItems = async (c: Context) => {
  try {
    await itemService.syncAllItems()
    return c.json({ message: 'Items sync completed successfully' })
  } catch (error) {
    console.error('Error syncing items:', error)
    return c.json({ error: 'Failed to sync items' }, 500)
  }
}
