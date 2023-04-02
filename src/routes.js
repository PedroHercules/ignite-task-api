export const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (req, res) => {
      res.end('Hello world!')
    }
  }
]