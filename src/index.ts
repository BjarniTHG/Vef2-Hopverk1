import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/authRoutes'

export const app = new Hono()
app.use('/*', cors())

app.route("/routes", authRoutes)

app.get('/', (c) => {
	const data: { message: string } = {
		message: 'Hopverkefni 1 í veforritun 2'
	}
	return c.json(data)
})

serve({
	fetch: app.fetch,
	port: 3000
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})