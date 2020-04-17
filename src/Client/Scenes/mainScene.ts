import Texts from '../Components/texts'
import Cursors from '../Components/cursors'
// import { setDudeAnimation } from '../components/animations'
import { world } from '../config'

import { SKINS, PROJECT_SIDE } from '../../constants'
import Hero from '../../Shared/GameObjects/Hero/Hero'

interface Objects {
  [key: string]: any
}

export default class MainScene extends Phaser.Scene {
  objects: Objects = {}
  sync: { initialState: boolean; objects: any[] } = {
    initialState: false,
    objects: []
  }
  socket: Socket

  cursors: Cursors | undefined
  level: number = 0

  constructor() {
    super({ key: 'MainScene' })
  }

  init(props: { scene: string; level: number; socket: Socket }) {
    const { scene, level = 0, socket } = props
    this.level = level
    this.socket = socket
    this.socket.emit('joinRoom', { scene, level })
  }

  syncGame(res: any) {
    if (res.O) {
      res.O = JSON.parse(res.O)

      this.sync.objects = [...this.sync.objects, ...res.O]
      this.sync.objects.forEach((obj: any) => {
        if (!this.objects[obj.id]) {
          const sprite = this.add
            .sprite(obj.x, obj.y, obj.skin.toString())
            .setOrigin(0.5)
            .setRotation(obj.angle || 0)
          this.objects[obj.id] = {
            sprite
          }
        }

        const sprite = this.objects[obj.id].sprite
        if (obj.tint) {
          sprite.setTint(obj.tint)
        }
        sprite.setVisible(!obj.dead)
      })
    }
  }

  create() {
    const socket = this.socket
    this.cursors = new Cursors(this, socket)

    const map = this.add.tilemap('tilemap')
    const tileset = map.addTilesetImage('tileset')
    const layer = map.createDynamicLayer('ground', tileset, 0 , 0)
    this.cameras.main.setBounds(world.x, world.y, world.width, world.height)

    socket.on('SyncGame', (res: any) => this.syncGame(res))
    socket.emit('getInitialState')

    this.game.events.on('focus', () => socket.emit('getInitialState'))

    //const hero = new Hero(this, { clientID: socket.clientId, socketId: '0', projectSide: PROJECT_SIDE.CLIENT, id: 0})
  }

  update(time: number, delta: number) {
    if (this.sync.objects.length > 0) {
      this.sync.objects.forEach(obj => {
        if (this.objects[obj.id]) {
          const sprite = this.objects[obj.id].sprite
          if (obj.dead !== null) sprite.setVisible(!obj.dead)
          if (obj.x !== null) sprite.x = obj.x
          if (obj.y !== null) sprite.y = obj.y
          if (obj.angle !== null && typeof obj.angle !== 'undefined') sprite.angle = obj.angle
          if (obj.skin !== null) {
            // if (obj.skin === SKINS.DUDE) {
            //   if (obj.animation !== null) setDudeAnimation(sprite, obj.animation)
            // }
          }
        }
      })
    }
    this.sync.objects = []
  }
}
