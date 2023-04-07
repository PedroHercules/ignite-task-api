import http from 'node:http'
import { routes } from './routes.js'
import { appJson } from './middlewares/app-json.js'
import { extractQueryParam } from './utils/extract-query-param.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await appJson(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (!route) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    return res.end('Not found')
  }

  const routeParams = req.url.match(route.path)
  const {query, ...params} = routeParams.groups
  req.params = params
  req.query = query ? extractQueryParam(query) : {}

  route.handler(req, res)
})

server.listen(3334, () => {
  console.log('Server started on port 3334!')
})