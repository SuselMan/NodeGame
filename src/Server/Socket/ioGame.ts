import RoomManager from '../Managers/roomManager'

/** Handles all the communication for /game namespace (ioNspGame) */
export default class IoGame {
  time = new Date()

  constructor(public ioNspGame: SocketIO.Namespace, public roomManager: RoomManager) {
    ioNspGame.on('connection', async (socket: Socket) => {
      roomManager.generateClientId(socket)

      socket.on('joinRoom', async (data: { scene: string; level: number }) => {
        const { scene, level } = data
        await roomManager.joinRoom(socket, scene, +level)
      })

      socket.on('disconnect', () => {
        roomManager.leaveRoom(socket)
      })

      socket.on('changeRoom', (data: { scene: string; level: number }) => {
        roomManager.changeRoom(socket, data.scene, +data.level)
      })

      socket.on('updateDude' /* short for updateDude */, (updates: any) => {
        if (roomManager.isRemoving(socket.room)) return
        if (!roomManager.userExists(socket.room, socket.id)) return

        roomManager.rooms[socket.room].users[socket.id].lastUpdate = Date.now()
        roomManager.rooms[socket.room].scene.events.emit('updateDude' /* short for updateDude */, {
          clientId: socket.clientId,
          updates
        })
      })

      socket.on('getInitialState', () => {
        if (roomManager.isRemoving(socket.room)) return
        if (!roomManager.roomExists(socket.room)) return
        if (!roomManager.rooms[socket.room].scene) return
        const payload = {
          time: this.time,
          // @ts-ignore
          O /* short for objects */: roomManager.rooms[socket.room].scene.getInitialState(),
          connectCounter: roomManager.getRoomUsersArray(socket.room).length,
          initialState: true,
          roomId: socket.room
        }

        socket.emit('S' /* short for syncGame */, payload)
        // ioNspGame.in(socket.room).emit('S' /* short for syncGame */, payload)
      })
    })
  }
}
