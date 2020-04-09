declare type Square = { x: number; y: number, w: number; h: number,}
declare type Size = { w: number; h: number,}
declare type HeroOptions = { socketId: string; clientID: number, state: HeroState }
declare type HeroState = {
  x: number,
  y: number,
  stateID: number,
  health: number,
  speed: number,
  stamina: number,
  isDeadObject: boolean
}

class HeroSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, w: number, h: number) {
    super(scene, 0, 0, '')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setFrame(0)
    this.body.setSize(w, h)
  }

  setAnimation(name: string) {
    console.log('DEFINE ME')
  }
}

class HeroCollider extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, square: Square) {
    super(scene, 0, 0, '')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.setSize(square.w, square.h)
    this.setCollideWorldBounds(true).setOrigin(0)
    this.setPosition(square.x, square.y)
  }
}

export default class Hero extends Phaser.GameObjects.Container {
  public static COLLIDER_SQUARE: Square = { x: 24, y: 45, w: 19, h: 8 }
  public static SIZES = {w: 64, h: 64 }
  public static MAX_HISTORY_LENGTH = 10
  private stateHistory: HeroState[] = []
  private currentState: HeroState
  private options: HeroOptions

  constructor(scene: Phaser.Scene, options: HeroOptions) {
    super(scene, 0, 0)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.options = options
    this.currentState = options.state
  }

  private setNewPosition() {
    this.setPosition(Phaser.Math.RND.integerInRange(0, 1000), Phaser.Math.RND.integerInRange(100, 300))
  }

  private postUpdate() {
    this.stateHistory.push({ ...this.currentState })
  }
}

