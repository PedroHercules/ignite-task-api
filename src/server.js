import http from 'node:http'
import { routes } from './routes.js'
import { appJson } from './middlewares/app-json.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await appJson(req, res)

  const route = routes.find(route => {
    return route.path === url && route.method === method
  })

  if (!route) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    return res.end('Not found')
  }

  route.handler(req, res)
})

server.listen(3334, () => {
  console.log('Server started on port 3334!')
})