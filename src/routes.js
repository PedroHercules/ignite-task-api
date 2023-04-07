import { buildRoutePath } from "../utils/build-route-path.js"
import { Database } from "./database/database.js"
import { randomUUID } from 'node:crypto'

const database = new Database()

function validateForm(body, res) {
  if (!body.title || !body.description) {
    res.statusCode = 400
    throw new Error('Title and description fields are required!')
  }
}

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/task'),
    handler: (req, res) => {
      try {
        validateForm(req.body, res)
        const { title, description } = req.body
        database.create('tasks', { 
          id: randomUUID(), 
          title, 
          description,
          completed_at: null,
        })
        return res.writeHead(201).end(JSON.stringify({ message: 'Task created!' }))
      } catch (error) {
        return res.writeHead(res.statusCode || 500).end(JSON.stringify({ message: error.message }))
      }
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const filters = search ? { title: search, description: search } : null
      const tasks = database.findAll('tasks', filters)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      try {
        validateForm(req.body, res)
        database.update('tasks', req.params.id, req.body)
        res.writeHead(200).end('Task updated!')
      } catch (error) {
        const [message, status] = error.message.split(',')
        const statusCode = status || res.statusCode
        return res.writeHead(statusCode || 500).end(JSON.stringify({ message }))
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      try {
        database.delete('tasks', req.params.id)
        res.writeHead(200).end('Task deleted!')
      } catch (error) {
        const [message, status] = error.message.split(',')
        return res.writeHead(status || 500).end(JSON.stringify({ message }))
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/task/:id/status'),
    handler: (req, res) => {
      try {
        const task = database.findOne('tasks', req.params.id)
        let completed_at = null
        if (!task.completed_at) {
          console.log('task.completed_at', task.completed_at)
          completed_at = new Date()
        }
        database.updateStatus('tasks', req.params.id, { completed_at })
        res.writeHead(200).end('Task updated!')
      } catch (error) {
        const [message, status] = error.message.split(',')
        return res.writeHead(status || 500).end(JSON.stringify({ message }))
      }
    }
  }
]