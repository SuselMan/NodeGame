import { world } from '../config'

import { SKINS, PROJECT_SIDE } from '../../constants'
import Hero from '../../Shared/GameObjects/Hero/Hero'

import Tilemap from '@client/Assets/tilemap.json'
import EmptyCollider from '@shared/GameObjects/EmptyCollider'

interface Objects {
  [key: string]: any
}

export default class GameScene extends Phaser.Scene {
  static lagLength: number = 2 // How many states keep to compensate lag
  private statesQueue: Array<any> = []
  private tick: number = 0;
  private socket: Socket
  private currentSelected: any
  private collidersGroup: Phaser.GameObjects.Group
  private heroGroup: Phaser.GameObjects.Group

  constructor() {
    super({ key: 'GameScene' })
  }

  init(props: { scene: string; socket: Socket }) {
    const { scene, socket } = props
    this.socket = socket
    this.socket.emit('joinRoom', { scene })
  }

  syncGame(res: any) {
    if (res.initialState && res.SyncObject) {
      this.tick = res.SyncObject.tick
    }
    if(res.SyncObject && res.SyncObject.objects) {
      this.statesQueue.push(res.SyncObject.objects);
    }
    // if (res.O) {
    //   res.O = JSON.parse(res.O)
    //
    //   this.sync.objects = [...this.sync.objects, ...res.O]
    //   this.sync.objects.forEach((obj: any) => {
    //     if (!this.objects[obj.id]) {
    //       const sprite = this.add
    //         .sprite(obj.x, obj.y, obj.skin.toString())
    //         .setOrigin(0.5)
    //         .setRotation(obj.angle || 0)
    //       this.objects[obj.id] = {
    //         sprite
    //       }
    //     }
    //
    //     const sprite = this.objects[obj.id].sprite
    //     if (obj.tint) {
    //       sprite.setTint(obj.tint)
    //     }
    //     sprite.setVisible(!obj.dead)
    //   })
    // }
  }

  create() {
    const socket = this.socket
    const map = this.add.tilemap('tilemap')
    const tileset = map.addTilesetImage('tileset')
    map.createDynamicLayer('ground', tileset, 0 , 0)
    this.cameras.main.setBounds(world.x, world.y, world.width, world.height)

    socket.on('SyncGame', (res: any) => this.syncGame(res))
    socket.emit('getInitialState')

    this.game.events.on('focus', () => socket.emit('getInitialState'))

    const hero = new Hero(this, { clientID: socket.clientId, socketId: '0', projectSide: PROJECT_SIDE.CLIENT, id: '0'})
    this.currentSelected = hero;
    this.defineListeners();

    this.collidersGroup = this.physics.add.staticGroup()
    this.heroGroup = this.add.group()
    this.heroGroup.add(hero)
    // @ts-ignore
    const colliders = Tilemap.layers[1].objects.filter((i) => i.type === 'collider')
    colliders.forEach((collider) => {
      const opts = { x: collider.x, y: collider.y, w: collider.width, h: collider.height}
      this.collidersGroup.add(new EmptyCollider(this,  opts))
    })
    //this.physics.add.collider(this.heroGroup, this.collidersGroup)
    //this.collidersGroup.refresh();
  }

  defineListeners() {
    this.input.on('pointerdown', (e: any) => {
      console.log('hi', e);
      if(this.currentSelected) {
        this.currentSelected.setMoveTarget({x: this.cameras.main.scrollX + e.downX, y: this.cameras.main.scrollY + e.downY})
      }
    })
  }

  update(time: number, delta: number) {
    if(this.currentSelected) {
      this.currentSelected.update();
      this.cameras.main.setScroll(this.currentSelected.x - this.cameras.main.width / 2, this.currentSelected.y - this.cameras.main.height / 2)
    }
    this.physics.world.collide(this.heroGroup, this.collidersGroup);
    // if (this.sync.objects.length > 0) {
    //   this.sync.objects.forEach(obj => {
    //     if (this.objects[obj.id]) {
    //       const sprite = this.objects[obj.id].sprite
    //       if (obj.dead !== null) sprite.setVisible(!obj.dead)
    //       if (obj.x !== null) sprite.x = obj.x
    //       if (obj.y !== null) sprite.y = obj.y
    //       if (obj.angle !== null && typeof obj.angle !== 'undefined') sprite.angle = obj.angle
    //       if (obj.skin !== null) {
    //         // if (obj.skin === SKINS.DUDE) {
    //         //   if (obj.animation !== null) setDudeAnimation(sprite, obj.animation)
    //         // }
    //       }
    //     }
    //   })
    // }
    // this.sync.objects = []
  }
}
