import express from 'express'
import cors from 'cors'
import http from 'http'
import { WebSocketServer, WebSocket } from 'ws'


const app = express()
app.use(cors)
app.use(express.json())

const server = http.createServer(app)

const wss = new WebSocketServer({ server })

wss.on('connection', (ws: WebSocket) => {
  ws.on('open', (message: string) => {
    console.log(JSON.parse(message))
  })


  ws.on('message', (message: string) => {
    const response = JSON.parse(message)

    if (response.event === 'login') {
      
      // const userAlreadyCreated = sessionStorage.getItem(response.data.username)

      // if (!userAlreadyCreated) {
      //   sessionStorage.setItem(response.data.username, '')
      // }
    }
  })
})

server.listen(3000, () => console.log('Server running on port 3000'))
