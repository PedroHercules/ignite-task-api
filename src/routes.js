import { buildRoutePath } from "../utils/build-route-path.js"
import { Database } from "./database/database.js"
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/task'),
    handler: (req, res) => {
      const { title, description } = req.body
      database.create('tasks', { 
        id: randomUUID(), 
        title, 
        description,
        completed_at: null,
      })
      res.writeHead(201).end('Task created!')
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.findAll('tasks')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      console.log(req.params)
      return res.end('PUT')
    }
  }
]