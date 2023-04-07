import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)
const fileStream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
})

async function sendCsv () {
  const fileParse = fileStream.pipe(csvParse)
  for await (const record of fileParse) {
      const [title, description] = record
      await fetch('http://localhost:3334/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      })
  }
}

sendCsv()