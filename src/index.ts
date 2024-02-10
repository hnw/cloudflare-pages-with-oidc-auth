import { Hono } from 'hono'
import { oidcAuthMiddleware, getAuth, revokeSession } from '@hono/oidc-auth'

const app = new Hono()

app.get('/logout', async (c) => {
  await revokeSession(c)
  return c.text(`Logged off`)
})
app.get('*', oidcAuthMiddleware(), async (c) => {
  const auth = await getAuth(c)
  if (!auth?.email.endsWith('@gmail.com')) {
    return c.text('Unauthorized', 401)
  }
  const response = await c.env.ASSETS.fetch(c.req.raw);
  // clone the response to return a response with modifiable headers
  const newResponse = new Response(response.body, response)
  return newResponse
});

export default app
