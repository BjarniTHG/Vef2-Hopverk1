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

const mockUsers = [
    { id: 1, name: "Eyglo", email: "eyglo@example.com" },
    { id: 2, name: "Bjarni", email: "bjarni@example.com" },
    { id: 3, name: "Þorri", email: "thorri@example.com"}
];

app.get('/users', (c) => {
    return c.json(mockUsers, 200)
})

app.get("/users/:id", (c) => {
    const id = Number(c.req.param("id"));

    // Finnum notanda í mock gögnunum
    const user = mockUsers.find((u) => u.id === id);

    // Skila 404 ef notandinn finnst ekki
    if (!user) {
        return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
});

// Ef beðið er um eitthvað sem ekki er til skal skila 404.
// Ef beðið er um einingu eða reynt að framkvæma aðgerð sem ekki er leyfi fyrir skal skila 401.
// Allar niðurstöður sem geta skilað mörgum færslum (fleiri en 10) skulu skila síðum.
// Ef villur koma upp skal skila 400 með viðeigandi villuskilaboðum.
// Huga að samræmi á heitum, slóðum og villuskilaboðum.

/*const availableRoutes = [
	{ method: "GET",  path: "/champions", description: "Get all champions" },
	{ method: "GET",  path: "/champions/:id", description: "Get champion by id" },
	{ method: "GET", path: "/champions?page=1&limit=20", description: "pagenation 1 to 31 with limit = 20"},
	{ method: "GET",  path: "/items", description: "Get all items" },
	{ method: "GET",  path: "/items/:id", description: "Get item by id" },
	{ method: "GET", path: "/items?page=1&limit=20", description: "pagenation 1 to 31 with limit=20"},
  ]
*/
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
