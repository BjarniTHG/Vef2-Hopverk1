import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import itemRouter from './routes/itemRoutes'
import testRouter from './routes/testRoutes'
import championRouter from './routes/championRoutes'

export const app = new Hono()
app.use('/*', cors())

app.get('/', (c) => {
	const data: { message: string } = {
		message: 'Hopverkefni 1 í veforritun 2'
	}
	return c.json(data)
})

app.route('/items', itemRouter)
app.route('/test', testRouter)
app.route('/champions', championRouter)

serve({
	fetch: app.fetch,
	port: 3000
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})
