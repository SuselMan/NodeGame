
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
          this.scene.start('GameScene', { scene: 'ArcadeScene', level: 0, socket: this.socket })
        })
    )
  }
}
