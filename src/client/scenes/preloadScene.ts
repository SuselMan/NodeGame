import io from 'socket.io-client'
import { SKINS } from '../../constants'
import { createDudeAnimations } from '../components/animations'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.setBaseURL('static/client')
    this.load.image('bug', 'assets/bug.png')

    this.load.image('tree_0', 'assets/tree_0.png')
    this.load.image('tree_1', 'assets/tree_1.png')
    this.load.image('brush', 'assets/brush.png')
    this.load.image('tileset', 'assets/tileset.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemap.json')
    this.load.json('treesData', 'assets/trees.json');


    this.load.spritesheet(SKINS.DUDE.toString(), 'assets/hero_run.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('fullscreen', 'assets/fullscreen.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create() {
    createDudeAnimations(this)

    // connecting to socket.io
    const url = `${location.origin}/G` /* short for stats */

    const socket = io.connect(url, { transports: ['websocket'] }) as Socket

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    socket.on('reconnect_attempt', () => {
      socket.io.opts.transports = ['polling', 'websocket']
    })

    socket.on('connect', () => {
      console.log("You're connected to socket.io")
    })

    // we wait until we have a valid clientId, then start the MainScene
    socket.on('clientId', (clientId: number) => {
      socket.clientId = clientId
      console.log('Your client id', clientId)
      this.scene.start('MenuScene', { socket })
    })
  }
}
