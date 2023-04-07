import fs from 'node:fs/promises'

const databasePath = new URL('./db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  create(table, data) {
    console.log('create', table, data)
    const isEmpty = !this.#database[table] || this.#database[table].length === 0
    const storeData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    }
    isEmpty ? this.#database[table] = [data] : this.#database[table].push(storeData)
    this.#persist()
  }

  findAll(table, query) {
    let data = this.#database[table] || []

    if (!query) {
      return data
    }

    data = data.filter(row => {
      return Object.keys(query).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      })
    })

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)
    if (rowIndex === -1) {
      const message = `Não existe um registro com o id ${id} na tabela ${table}!`
      const status = 404
      const error = message.concat(',', status)
      throw new Error(error)
    }
    const updated_at = new Date()
    const row = this.#database[table][rowIndex]
    const updatedRow = {
      id,
      title: data.title || row.title,
      description: data.description || row.description,
      completed_at: data.completed_at || row.completed_at,
      created_at: row.created_at,
      updated_at,
    }
    this.#database[table][rowIndex] = updatedRow
    this.#persist()

    return true
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex === -1) {
      const error = `NOT FOUND: Não existe um registro com o id ${id} na tabela ${table}!`
      const status = 404
      throw new Error(error, status)
    }
    this.#database[table].splice(rowIndex, 1)
    this.#persist()
    return true
  }
}