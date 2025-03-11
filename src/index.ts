import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/authRoutes'

export const app = new Hono()
app.use('/*', cors())

app.route("/routes", authRoutes)

// GET á / skal skila lista af slóðum í mögulegar aðgerðir.
// placeholder aðgerðir, þar til meira kemur
app.get('/', (c) => {
	const data: { 
		message: string;
		routes: { method: string; path: string }[];
	} = {
		message: 'Hopverkefni 1 í veforritun 2',
		routes: [
			{ method: 'GET', path: '/users' },
			{ method: 'POST', path: '/users' },
			{ method: 'POST', path: '/login' },
			{ method: 'GET', path: '/posts' },
			{ method: 'POST', path: '/posts' }
		]
	}
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

serve({
	fetch: app.fetch,
	port: 3000
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})