export default class Control extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, public btn: string) {
    super(scene, x, y, 'controls')
    scene.add.existing(this)

    this.setInteractive()
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDepth(2)

    if (!scene.sys.game.device.input.touch) this.setAlpha(0)
  }
}
