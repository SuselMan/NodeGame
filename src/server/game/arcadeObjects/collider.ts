export default class Box extends Phaser.Physics.Arcade.Sprite {
  id: string

  constructor(scene: Phaser.Scene, id: number, x: number, y: number, w: number, h: number) {
    super(scene, x + w / 2, y + h / 2, '', )
    scene.add.existing(this)
    scene.physics.add.existing(this, true)

    // @ts-ignore
    this.body
      .setSize(w, h)

    this.id = id.toString()
  }
}
