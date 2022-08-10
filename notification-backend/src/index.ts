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
  ws.on('message', (message: string) => {
    console.log(message)
  })

  ws.send('Hiii');
})


app.listen(3000, () => console.log('Server running on port 3000'))
