import RoomManager from '@server/Managers/roomManager'

export default class BaseScene extends Phaser.Scene {
  roomManager: RoomManager
  roomId: any
  uID: number = 0
  uIDDate: number = (new Date).getTime()
  get uniqID () {
    return `${this.uIDDate}${this.uID++}`
  }

  init() {
    // @ts-ignore
    const { roomId, roomManager } = this.game.config.preBoot()
    this.roomManager = roomManager
    this.roomId = roomId
  }
}
