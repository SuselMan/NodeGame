import Texts from '../components/texts'
import Cursors from '../components/cursors'
import { setDudeAnimation } from '../components/animations'
import { world } from '../config'

import SyncManager from '../../server/managers/syncManager'
import { SKINS } from '../../constants'

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

  create() {
    const socket = this.socket
    const levelText = this.add
      .text(0, 0, `Level ${this.level + 1}`, {
        color: '#556539',
        fontSize: 42
      })
      .setOrigin(0.5, 0)
      .setDepth(100)
      .setScrollFactor(0)

   // const starfield = this.add.tileSprite(world.x, world.y, world.width, world.height, 'starfield').setOrigin(0)
    this.cursors = new Cursors(this, socket)
    const texts = new Texts(this)

    const map = this.add.tilemap('tilemap')
    const tileset = map.addTilesetImage('tileset')
    const layer = map.createDynamicLayer('ground', tileset, 0 , 0)
    this.cameras.main.setBounds(world.x, world.y, world.width, world.height)

    socket.on('changingRoom', (data: { scene: string; level: number }) => {
      console.log('You are changing room')
      // destroy all objects and get new onces
      Object.keys(this.objects).forEach((key: string) => {
        this.objects[key].sprite.destroy()
        delete this.objects[key]
      })
      socket.emit('getInitialState')
      this.level = data.level || 0
      levelText.setText(`Level ${this.level + 1}`)
    })

    socket.on('SyncGame' /* short for syncGame */, (res: any) => {
      if (res.connectCounter) texts.setConnectCounter(res.connectCounter)
      if (res.time) texts.setTime(res.time)
      if (res.roomId) texts.setRoomId(res.roomId)

      // res.O (objects) contains only the objects that need to be updated
      if (res.O /* short for objects */) {
        res.O = SyncManager.decode(res.O)

        this.sync.objects = [...this.sync.objects, ...res.O]
        this.sync.objects.forEach((obj: any) => {
          // the if the player's dude is in the objects list the camera follows it sprite
          if (this.objects[obj.id] && obj.skin === SKINS.DUDE && obj.clientId && +obj.clientId === +socket.clientId) {
            this.cameras.main.setScroll(obj.x - this.cameras.main.width / 2, obj.y - this.cameras.main.height / 2)
          }

          // if the object does not exist, create a new one
          if (!this.objects[obj.id]) {
            const sprite = this.add
              .sprite(obj.x, obj.y, obj.skin.toString())
              .setOrigin(0.5)
              .setRotation(obj.angle || 0)

            // add the sprite by id to the objects object
            this.objects[obj.id] = {
              sprite
            }
          }

          // set some properties to the sprite
          const sprite = this.objects[obj.id].sprite
          if (obj.tint) {
            sprite.setTint(obj.tint)
          }
          // set visibility
          sprite.setVisible(!obj.dead)
        })
      }
    })
    // request the initial state
    socket.emit('getInitialState')

    // request the initial state if the game gets focus
    // e.g. if the users comes from another tab or window
    this.game.events.on('focus', () => socket.emit('getInitialState'))

    // this helps debugging
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      console.log(pointer.worldX, pointer.worldY)
    })
  }

  update(time: number, delta: number) {
    // update all objects
    if (this.sync.objects.length > 0) {
      this.sync.objects.forEach(obj => {
        if (this.objects[obj.id]) {
          const sprite = this.objects[obj.id].sprite
          if (obj.dead !== null) sprite.setVisible(!obj.dead)
          if (obj.x !== null) sprite.x = obj.x
          if (obj.y !== null) sprite.y = obj.y
          if (obj.angle !== null && typeof obj.angle !== 'undefined') sprite.angle = obj.angle
          if (obj.skin !== null) {
            if (obj.skin === SKINS.DUDE) {
              if (obj.animation !== null) setDudeAnimation(sprite, obj.animation)
            }
          }
        }
      })
    }
    this.sync.objects = []
  }
}
