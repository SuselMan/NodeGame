import 'source-map-support/register'

import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import path from 'path'
import { Server } from 'http'

const app = express()
const server = new Server(app)
import SocketIOStatic from 'socket.io'
const io = SocketIOStatic(server)

import RoomManager from './managers/roomManager'
import Routes from './routes/routes'
import IoGame from './socket/ioGame'

const port = process.env.PORT || 3000

// create 2 socket.io namespaces
const ioNspGame = io.of('/G')

const roomManager = new RoomManager(ioNspGame)
const ioGame = new IoGame(ioNspGame, roomManager)

app.use(helmet())
app.use(compression())

app.use('/static', express.static(path.join(__dirname, '../')))
app.use('/', new Routes(roomManager).router)

server.listen(port, () => {
  console.log('App is listening on port ' + port)
})
