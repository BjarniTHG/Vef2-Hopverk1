import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import itemRouter from './routes/itemRoutes'
import testRouter from './routes/testRoutes'
import championRouter from './routes/championRoutes'
import authRoutes from './routes/authRoutes'
import accountRoutes from './routes/accountRoutes'
import { createAdminUser } from './services/authService'
import { rateLimiter } from './middleware/rateLimiter'

createAdminUser().catch(console.error);

export const app = new Hono()
app.use('/*', cors())
app.use('/*', rateLimiter(100, 60000)); // 100 requests per minute

app.use('/*', async (c, next) => {
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Content-Security-Policy', "default-src 'self'");
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  await next();
});

app.route("/routes", authRoutes)
app.route('/items', itemRouter)
app.route('/test', testRouter)
app.route('/champions', championRouter)
app.route('/account', accountRoutes)

app.get('/', (c) => {
  const data = {
    message: 'Hopverkefni 1 í veforritun 2',
    routes: {
      authentication: [
        { method: 'POST', path: '/routes/register', description: 'Register a new user' },
        { method: 'POST', path: '/routes/login', description: 'Log in an existing user' }
      ],
      account: [
        { method: 'POST', path: '/account/upload', description: 'Upload profile picture', requiresAuth: true },
        { method: 'POST', path: '/account/update-username', description: 'Update username', requiresAuth: true },
        { method: 'POST', path: '/account/update-password', description: 'Update password', requiresAuth: true }
      ],
      champions: [
        { method: 'GET', path: '/champions', description: 'Get all champions with pagination' },
        { method: 'GET', path: '/champions/:id', description: 'Get champion by ID' },
        { method: 'POST', path: '/champions/sync', description: 'Sync champions with LoL API', requiresAuth: true, requiresAdmin: true },
        { method: 'POST', path: '/champions/:id/favorite', description: 'Favorite a champion', requiresAuth: true },
        { method: 'DELETE', path: '/champions/:id/favorite', description: 'Unfavorite a champion', requiresAuth: true }
      ],
      items: [
        { method: 'GET', path: '/items', description: 'Get all items with pagination' },
        { method: 'GET', path: '/items/:id', description: 'Get item by ID' },
        { method: 'POST', path: '/items/sync', description: 'Sync items with LoL API', requiresAuth: true, requiresAdmin: true }
      ]
    }
  };
  return c.json(data);
});

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
