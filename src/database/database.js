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
    isEmpty ? this.#database[table] = [data] : this.#database[table].push(data)
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
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex === -1) {
      throw new Error(`Não existe um registro com o id ${id} na tabela ${table}!`)
    }
    this.#database[table][rowIndex] = {id, ...data}
    this.#persist()

    return true
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex === -1) {
      throw new Error(`Não existe um registro com o id ${id} na tabela ${table}!`)
    }
    this.#database[table].splice(rowIndex, 1)
    this.#persist()
    return true
  }
}