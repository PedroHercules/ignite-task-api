import { Database } from "./database/database.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (req, res) => {
      res.end('Hello world!')
    }
  },
  {
    method: 'POST',
    path: '/task',
    handler: (req, res) => {
      const { title, description } = req.body
      database.create('tasks', { title, description })
      res.writeHead(201).end('Task created!')
    }
  },
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      const tasks = database.findAll('tasks')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(tasks))
    }
  }
]