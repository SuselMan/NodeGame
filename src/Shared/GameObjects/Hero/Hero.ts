import { createAnimations } from './HeroAnimations'
import EmptyCollider from '../EmptyCollider'
import { SKINS, PROJECT_SIDE } from '../../../constants'

declare type HeroOptions = { socketId: string; clientID: number, projectSide: string, id: string}
declare type HeroState = {
  x: number,
  y: number,
  stateID: number,
  health: number,
  speed: number,
  stamina: number,
  isDeadObject: boolean
  currentAnimation: string
}

export default class Hero extends Phaser.GameObjects.Container {
  public static readonly type = 'HERO'
  private static COLLIDER_SQUARE: Square = { x: 22, y: 44, w: 24, h: 10 }
  private static SIZES = {w: 64, h: 64 }
  private static MAX_HISTORY_LENGTH = 10
  private stateHistory: HeroState[] = []
  public currentState: HeroState
  private options: HeroOptions
  public collider: EmptyCollider
  private sprite: Phaser.Physics.Arcade.Sprite

  constructor(scene: Phaser.Scene, options?: HeroOptions) {
    super(scene, 400, 400)
    scene.add.existing(this)
    if(options) this.options = options
    this.collider = new EmptyCollider(scene, Hero.COLLIDER_SQUARE)
    this.add(this.collider);
    if(this.options.projectSide === PROJECT_SIDE.CLIENT) {
      this.createSprite(scene, Hero.SIZES)
      this.add(this.sprite)
    }
    this.currentState = this.getInitialState()
  }

  public static createAnimations(scene: Phaser.Scene): void {
    createAnimations(scene)
  }

  public setAnimation (animation: string = 'idle') {
    this.currentState.currentAnimation = animation;
    if(this.options.projectSide === PROJECT_SIDE.SERVER) return
    if (!this.sprite.anims.isPlaying) this.sprite.play(animation)
    else if (this.sprite.anims.isPlaying && this.sprite.anims.getCurrentKey() !== animation) this.sprite.play(animation)
  }

  private createSprite(scene: Phaser.Scene, size: Size): void {
    const sprite = new Phaser.Physics.Arcade.Sprite(scene, 0,0, SKINS.DUDE.toString())
    scene.add.existing(sprite)
    scene.physics.add.existing(sprite)
    sprite.setOrigin(0)
    sprite.setFrame(0)
    sprite.setSize(size.w, size.h)
    this.sprite = sprite;
  }

  private getInitialState(): HeroState {
    return {
      x: this.x,
      y: this.y,
      stateID:0,
      health: 100,
      speed: 300,
      stamina: 100,
      isDeadObject: false,
      currentAnimation: 'idle',
    }
  }

  private setNewPosition() {
    this.setPosition(Phaser.Math.RND.integerInRange(0, 1000), Phaser.Math.RND.integerInRange(100, 300))
  }

  private postUpdate() {
    this.stateHistory.push({ ...this.currentState })
  }
}

