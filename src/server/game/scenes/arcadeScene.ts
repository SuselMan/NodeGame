import { world } from '../../../client/config'
import Dude from '../arcadeObjects/dude'
import Collider from '../arcadeObjects/collider'
import Cursors from '../../../client/components/cursors'
import SyncManager from '../../managers/syncManager'
import RoomManager from '../../managers/roomManager'
import Hero from '../../../shared/units/Hero'

import tilemap from '../../../client/assets/tilemap.json'
import tileset from '../../../client/assets/tileset.json'
import trees from '../../../client/assets/trees.json'

export default class MainScene extends Phaser.Scene {
  id = 0
  dudeGroup: Phaser.GameObjects.Group
  heroGroup: Phaser.GameObjects.Group
  collidersGroup: Phaser.GameObjects.Group
  debug: any = {}
  objectsToSync: any = {}
  tick = 0
  roomManager: RoomManager
  roomId: string

  constructor() {
    // @ts-ignore
    super({ key: 'MainScene', plugins: ['Clock'], active: false, cameras: null })
    // see all scene plugins:
    // Phaser.Plugins.DefaultScene
    // https://github.com/photonstorm/phaser/blob/master/src/plugins/DefaultPlugins.js#L76
  }

  /** Create a new object id */
  newId() {
    return this.id++
  }

  init() {
    try {
      // @ts-ignore
      const { roomId, roomManager } = this.game.config.preBoot()
      this.roomManager = roomManager
      this.roomId = roomId
    } catch (error) {
      console.error('onInit() failed!')
    }
  }

  preload() {
    console.log('THIS IS ACTUALLY NEVER CALLED! WHY?')
  }

  create() {
    // this will stop the scene
    this.events.addListener('stopScene', () => {
      this.scene.stop()
    })

    this.physics.world.setBounds(world.x, world.y, world.width, world.height)
    this.dudeGroup = this.add.group()
    this.heroGroup = this.add.group()
    this.collidersGroup = this.add.group()
    // @ts-ignore
    const colliders = tilemap.layers[1].objects.filter((i) => i.type === 'collider')
    colliders.forEach((collider) => {
      this.collidersGroup.add(new Collider(this, this.newId(), collider.x, collider.y, collider.width, collider.height))
    })

    // this.events.addListener('createDude', (clientId: number, socketId: string) => {
    //   let dude: Dude = this.dudeGroup.getFirstDead()
    //   if (dude) {
    //     dude.revive(clientId, socketId)
    //   } else {
    //     dude = new Dude(this, this.newId(), { clientId, socketId })
    //     this.dudeGroup.add(dude)
    //   }
    // })

    this.events.addListener('createDude', (clientId: number, socketId: string) => {
      const hero: Hero = new Hero(this, {clientID: clientId, socketId,
        state: {x:20, y: 20, stateID: 0, stamina: 100, health: 100, isDeadObject: false, speed: 300}})
      this.heroGroup.add(hero)
    })

    this.events.addListener('U' /* short for updateDude */, (res: any) => {
      // @ts-ignore
      const dude: Dude = this.dudeGroup.children.getArray().find((dude: Dude) => {
        // todo: this can take too much time for big amount of users ( > 100 ?), use hash table
        // and why FILTER instead of find??? stupid actually
        return dude.clientId && dude.clientId === res.clientId
      })
      if (dude) {
        const b = res.updates
        // console.log('down', b >= 25 ? true : false, b)
        const updates = {
          left: b === 1 || b === 5 || b === 26 ? true : false,
          right: b === 2 || b === 6 || b === 27 ? true : false,
          up: b === 4 || b === 6 || b === 5 || b === 29 ? true : false,
          down: b >= 25 ? true : false,
          none: b === 8 ? true : false
        }
        dude.setUpdates(updates)
      }
    })

    this.events.addListener('removeDude', (clientId: number) => {
      // @ts-ignore
      this.dudeGroup.children.iterate((dude: Dude) => {
        if (dude.clientId === clientId) {
          dude.kill()
        }
      })
    })

    this.physics.add.collider(this.dudeGroup, this.collidersGroup)
  }

  /** Sends the initial state to the client */
  getInitialState() {
    const objects: any[] = []
    SyncManager.prepareFromPhaserGroup(this.dudeGroup, objects)

    return SyncManager.encode(objects)
  }

  update() {
    this.tick++
    if (this.tick > 1000000) this.tick = 0

    const prepareObjectToSync = (obj: any) => {
      const cleanObjectToSync = SyncManager.cleanObjectToSync(obj)
      this.objectsToSync = SyncManager.mergeObjectToSync(cleanObjectToSync, this.objectsToSync)
    }

    // @ts-ignore
    // this.boxGroup.children.iterate((child: Box) => {
    //   if (child.sync) {
    //     const object = {
    //       skin: child.skin,
    //       id: child.id,
    //       x: child.body.position.x + child.body.width / 2,
    //       y: child.body.position.y + child.body.height / 2
    //     }
    //     prepareObjectToSync(object)
    //   }
    //   child.sync = false
    // })
    // @ts-ignore
    this.dudeGroup.children.iterate((child: Dude) => {
      child.update()
      // we only update the dude if one if the 4 properties below have changed
      const x = child.prevPosition.x.toFixed(0) !== child.body.position.x.toFixed(0)
      const y = child.prevPosition.y.toFixed(0) !== child.body.position.y.toFixed(0)
      const dead = child.prevDead !== child.dead
      const color = child.prevColor.toString() !== child.color.toString()
      if (x || y || dead || color) {
        const object = {
          animation: child.animation,
          dead: child.dead,
          clientId: child.clientId,
          skin: child.skin,
          tint: child.color,
          id: child.id,
          x: child.body.position.x + child.body.width / 2,
          y: child.body.position.y + child.body.height / 2
        }
        prepareObjectToSync(object)
      }
      child.postUpdate()
    })

    const send: any[] = []

    Object.keys(this.objectsToSync).forEach(key => {
      send.push(this.objectsToSync[key])
      delete this.objectsToSync[key]
    })

    if (send.length > 0) {
      setTimeout(() => {
        this.roomManager.ioNspGame
          .in(this.roomId)
          .emit('SyncGame' /* short for syncGame */, { O /* short for objects */: SyncManager.encode(send) })
      }, 100)
      // send the objects to sync to all connected clients in this.roomId
    }
  }
}
