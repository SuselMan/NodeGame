export default class EmptyCollider extends Phaser.GameObjects.Zone {

  constructor(scene: Phaser.Scene, square: Square) {
    super(scene, square.x, square.y, square.w, square.h)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setPosition(square.x, square.y)
    this.setOrigin(0)
  }
}