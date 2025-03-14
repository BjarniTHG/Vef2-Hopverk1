import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import itemRouter from './routes/itemRoutes'
import testRouter from './routes/testRoutes'
import championRouter from './routes/championRoutes'
import authRoutes from './routes/authRoutes'
import { describe } from 'node:test'

export const app = new Hono()
app.use('/*', cors())

app.route("/routes", authRoutes)
app.route('/items', itemRouter)
app.route('/test', testRouter)
app.route('/champions', championRouter)

const availableRoutes = [
	{ method: "GET",  path: "/champions", description: "Get all champions" },
	{ method: "GET",  path: "/champions/:id", description: "Get champion by id" },
	{ method: "GET", path: "/champions?page=1&limit=20", description: "pagenation 1 to 31 with limit = 20"},
	{ method: "GET",  path: "/items", description: "Get all items" },
	{ method: "GET",  path: "/items/:id", description: "Get item by id" },
	{ method: "GET", path: "/items?page=1&limit=20", description: "pagenation 1 to 31 with limit=20"},
  ]

app.get('/', (c) => {
	return c.json({
	description: 'Hopverkefni 1 í veforritun 2',
	  message: 'Available Routes',
	  routes: availableRoutes
	})
  })

// Í öllum vefþjónustuköllum er skilað 
app.use('*', async (c, next) => {
	try {
		await next()
	} catch (err) {
		console.error(err)
		c.status(400)
		return c.json({ message: 'Internal Server Error' })
	}
})

serve({
	fetch: app.fetch,
	port: 3000
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})
