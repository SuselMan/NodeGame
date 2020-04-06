import Resize from '../components/resize'

export default class MenuScene extends Phaser.Scene {
  socket: Socket
  constructor() {
    super({ key: 'MenuScene' })
  }

  init(props: { socket: Socket }) {
    const { socket } = props
    this.socket = socket
  }

  create() {
    const styles = {
      color: '#000000',
      align: 'center',
      fontSize: 52
    }

    const texts: any[] = []

    texts.push(this.add.text(0, 0, 'Hi, this is the game!', styles).setOrigin(0.5, 0))

    texts.push(
      this.add
        .text(0, 0, 'Arcade Physics (Level 1)', styles)
        .setOrigin(0.5, 0)
        .setInteractive()
        .on('pointerdown', () => {
          this.scene.start('MainScene', { scene: 'ArcadeScene', level: 0, socket: this.socket })
        })
    )

    const resize = () => {
      const { centerX, centerY } = this.cameras.main
      const posY = [20, centerY - 100, centerY - 10, centerY + 60, centerY + 130]
      texts.forEach((text, i) => {
        text.setPosition(centerX, posY[i])
      })
    }

    this.scale.on('resize', (gameSize: any, baseSize: any, displaySize: any, resolution: any) => {
      if (!this.scene.isActive()) return
      this.cameras.resize(gameSize.width, gameSize.height)
      resize()
    })
    resize()
    Resize(this.game)
  }
}
