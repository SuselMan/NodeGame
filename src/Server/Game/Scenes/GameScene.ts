import BaseScene from './BaseScene'
import { world } from '@client/config'
import RoomManager from '@server/Managers/roomManager'
import Hero from '@shared/GameObjects/Hero/Hero'
import Tilemap from '@client/Assets/tilemap.json'
import EmptyCollider from '@shared/GameObjects/EmptyCollider'

export default class GameScene extends BaseScene {
  // TODO: Realize syncable object interface
  allSyncObject: Array<any> = [];
  heroGroup: Phaser.GameObjects.Group
  heroHash: any = {};
  collidersGroup: Phaser.GameObjects.Group
  roomManager: RoomManager
  roomId: string
  heroTest: Hero;

  constructor() {
    super({ key: 'GameScene', plugins: ['Clock'], active: false })
  }

  create() {
    this.prepareScene()
    this.events.addListener('createDude', this.createDude.bind(this))
    this.events.addListener('updateDude' , this.updateDude.bind(this))
    this.events.on('postupdate', () => this.postUpdate());
  }

  initGroups(): void {
    this.heroGroup = this.add.group()
    this.collidersGroup = this.add.group()
  }

  prepareScene(): void {
    this.initGroups()
    this.physics.world.setBounds(world.x, world.y, world.width, world.height)
    // @ts-ignore
    const colliders = Tilemap.layers[1].objects.filter((i) => i.type === 'collider')
    colliders.forEach((collider) => {
      const opts = { x: collider.x, y: collider.y, w: collider.width, h: collider.height}
      this.collidersGroup.add(new EmptyCollider(this,  opts))
    })
    this.physics.add.collider(this.heroGroup, this.collidersGroup)
  }

  createDude(clientId: number, socketId: string) {
    this.heroTest = new Hero(this, {clientID: clientId, socketId, projectSide: 'SERVER', id: this.uniqID })
    this.heroGroup.add(this.heroTest)
    this.allSyncObject.push(this.heroTest)
    this.heroHash[clientId] = this.heroTest
  }

  updateDude(params: any): void {
    console.log(params)
    this.heroTest.setMoveTarget(params.updates)
    // if(this.heroHash[params.clientId]) {
    //   // and apply changes
    //   this.tickChangedObjects.push(this.heroHash[params.clientId]);
    // }
    // TODO: define params as a type!
    // if(this.heroHash[params.clientId]) {
    //   const b = params.updates
    //   // TODO: make better actions this is a shit
    //   const updates = {
    //     left: b === 1 || b === 5 || b === 26 ? true : false,
    //     right: b === 2 || b === 6 || b === 27 ? true : false,
    //     up: b === 4 || b === 6 || b === 5 || b === 29 ? true : false,
    //     down: b >= 25 ? true : false,
    //     none: b === 8 ? true : false
    //   }
    //   this.heroHash[params.clientId].setUpdates(updates)
    // }
  }

  getFullState() {
    // TODO: realise syncable as interface;
    const objects = this.allSyncObject.map((obj: any) => ({ tick: this.tick, ...obj.getSyncObject() }))
    return JSON.stringify({ tick: this.tick, objects })
  }

  update() {
      super.update()
    this.heroTest.update();
      // this.roomManager.ioNspGame
      //   .in(this.roomId)
      //   .emit('SyncGame', { SyncObject: JSON.stringify([]) })
    }

  postUpdate() {
    //console.log(this.roomManager)
    setTimeout(() => {
      this.roomManager.ioNspGame
        .in(this.roomId)
        .emit('SyncGame', this.getFullState())
    }, Math.random()* 500)

  }
}
