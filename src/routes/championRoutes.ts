import { Hono } from 'hono'
import * as championController from '../controllers/championController'
// import { authenticate, isAdmin } from '../middleware/auth'

const championRouter = new Hono()

// routes
championRouter.get('/', championController.getAllChampions)
championRouter.get('/:id', championController.getChampionById)

championRouter.post('/sync', championController.syncChampions)

// Bæta aftur við seinna þegar auth er komið í gang
// championRouter.post('/:id/favorite', authenticate, championController.favoriteChampion)
// championRouter.delete('/:id/favorite', authenticate, championController.unfavoriteChampion)

export default championRouter
