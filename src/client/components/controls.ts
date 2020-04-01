import Control from './control'

export default class Controls {
  left = false
  right = false
  down = false
  up = false
  controls: Control[] = []
  none = true
  prevNone = true

  constructor(public scene: Phaser.Scene, public socket: SocketIOClient.Socket) {
    // add a second pointer
    scene.input.addPointer()

    const detectPointer = (gameObject: Control, down: boolean) => {
      if (gameObject.btn) {
        switch (gameObject.btn) {
          case 'left':
            this.left = down
            break
          case 'right':
            this.right = down
            break
          case 'up':
            this.up = down
            break
          case 'down':
            this.up = down
            break
        }
      }
    }
    scene.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Control) =>
      detectPointer(gameObject, true)
    )
    scene.input.on('gameobjectup', (pointer: Phaser.Input.Pointer, gameObject: Control) =>
      detectPointer(gameObject, false)
    )

    const left = new Control(scene, 0, 0, 'left').setRotation(-0.5 * Math.PI)
    const right = new Control(scene, 0, 0, 'right').setRotation(0.5 * Math.PI)
    const up = new Control(scene, 0, 0, 'up')
    const down = new Control(scene, 0, 0, 'down')
    this.controls.push(left, right, up, down)
    this.resize()

    this.scene.events.on('update', this.update, this)
  }

  controlsDown() {
    return { left: this.left, right: this.right, up: this.up, down: this.down, none: this.none }
  }

  resize() {
    const SCALE = 1
    const controlsRadius = (192 / 2) * SCALE
    const w = this.scene.cameras.main.width - 10 - controlsRadius
    const h = this.scene.cameras.main.height - 10 - controlsRadius
    const positions = [
      {
        x: controlsRadius + 10,
        y: h
      },
      { x: controlsRadius + 214, y: h },
      { x: w, y: h },
      { x: w, y: -h }
    ]
    this.controls.forEach((ctl, i) => {
      ctl.setPosition(positions[i].x, positions[i].y)
      ctl.setScale(SCALE)
      console.log(this)
    })
  }

  update() {
    this.none = this.left || this.right || this.up || this.down ? false : true

    if (!this.none || this.none !== this.prevNone) {
      let total = 0
      if (this.left) total += 1
      if (this.right) total += 2
      if (this.up) total += 4
      if (this.down) total += 25
      if (this.none) total += 8
      console.log('toatl', total)
      this.socket.emit('U' /* short for updateDude */, total)
    }

    this.prevNone = this.none
  }
}