import http from 'node:http'

const server = http.createServer((req, res) => {
  res.end('Hello world!')
})

server.listen(3334, () => {
  console.log('Server started on port 3334!')
})