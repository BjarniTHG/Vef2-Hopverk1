import { Context } from 'hono'
import * as championService from '../services/championService'
// import { z } from 'zod'

export const getAllChampions = async (c: Context) => {
  try {
    // Extract query parametera með default gildum
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    
    // Kalla á service
    const result = await championService.getAllChampions(page, limit)
    
    // Skila formatted response
    return c.json(result)
  } catch (error) {
    console.error('Error fetching champions:', error)
    return c.json({ error: 'Failed to fetch champions' }, 500)
  }
}

export const getChampionById = async (c: Context) => {
  try {
    // Extracta path parameterinn
    const id = c.req.param('id')
    
    // Kalla á service
    const champion = await championService.getChampionById(id)
    
    // Höndla not found case
    if (!champion) {
      return c.json({ error: 'Champion not found' }, 404)
    }
    
    // Returna success response
    return c.json(champion)
  } catch (error) {
    console.error(`Error fetching champion with ID ${c.req.param('id')}:`, error)
    return c.json({ error: 'Failed to fetch champion' }, 500)
  }
}

export const syncChampions = async (c: Context) => {
    try{
        await championService.syncAllChampions()
        return c.json({message: 'Champions sync completed successfully'})
    } catch(error){
        console.error('Villa við að synca champions: ', error)
        return c.json({error: 'Villa við að synca champions'}, 500)
    }
}
