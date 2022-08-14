import express from 'express'
import cors from 'cors'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(cors)
app.use(express.json())

const server = http.createServer(app)

const wss = new WebSocketServer({ server })

if (!fs.existsSync(path.join(__dirname, '..', 'database.json'))) {
  fs.writeFileSync(path.join(__dirname, '..', 'database.json'), JSON.stringify({
    info: 'Database'
  }))
}

let database

interface Message {
  id: string
  message: string
}

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    const response = JSON.parse(message)

    const { event, data } = response

    let responseData;

    const buffer = fs.readFileSync(
      path.join(__dirname, '..', 'database.json'),
      'utf-8'
    )

    if (event === 'message:create') {
      const sessionId = data.id
      
      database = JSON.parse(buffer) as { [key: string]: any }

      if (database[sessionId] !== undefined) {
        const messages = database[sessionId].messages as Message[]

        const id = uuidv4()

        const message = { id, message: data.message, owner: data.id, date: new Date() }

        messages.push(message)

        database[sessionId].messages = messages

        responseData = message;
      } else {
        const id = uuidv4()
        
        const message = { id, message: data.message, owner: data.id, date: new Date() }

        database[sessionId] = {
          messages: [
            message
          ]
        }

        responseData = message;
      }
  
      fs.unlinkSync(path.join(__dirname, '..', 'database.json'))
  
      fs.writeFileSync(
        path.join(__dirname, '..', 'database.json'),
        JSON.stringify(database)
      )
  
      const response = {
        event: 'message:create',
        data: responseData
      }

      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(response));
        }
      })
    } else if (event == 'establish') {
      // const { sessionId } = data

      const buffer = fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf-8')

      database = JSON.parse(buffer) as { [key: string]: any }

      const messagesofUsers = Object.values(database).filter(item => item !== 'Database')

      const messages = []

      for (const messageObject of messagesofUsers) {
        const messageList = Object.values(messageObject)[0] as any[]
        for (const message of messageList) {
          messages.push(message)
        }
      }

      messages.sort((a, b) => a - b)

      const response = {
        event: 'message:recover',
        data: messages ?? undefined
      }

      ws.send(JSON.stringify(response))
    }
  })
})

server.listen(3000, () => console.log('Server running on port 3000'))
