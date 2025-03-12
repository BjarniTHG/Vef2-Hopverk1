import { Hono } from 'hono'
import * as itemController from '../controllers/itemController'

const itemRouter = new Hono()

// Public routes
itemRouter.get('/', itemController.getAllItems)
itemRouter.get('/:id', itemController.getItemById)

// Admin routes
itemRouter.post('/sync', itemController.syncItems)

export default itemRouter
