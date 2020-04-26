import { createAnimations } from './HeroAnimations'
import EmptyCollider from '../EmptyCollider'
import { SKINS, PROJECT_SIDE } from '../../../constants'

declare type HeroOptions = { socketId: string; clientID: number, projectSide: string, id: string}
declare type HeroState = {
  stateID: number,
  health: number,
  speed: number,
  stamina: number,
  isDeadObject: boolean
  currentAnimation: string
  currentTarget?: {x: number, y: number}
}

export default class Hero extends Phaser.GameObjects.Container {
  public static readonly type = 'HERO'
  private static COLLIDER_SQUARE: Square = { x: 22, y: 44, w: 24, h: 10 }
  private static SIZES = {w: 64, h: 64 }
  private static MAX_HISTORY_LENGTH = 10
  public currentState: HeroState
  private options: HeroOptions  
  public collider: EmptyCollider
  private sprite: Phaser.Physics.Arcade.Sprite

  constructor(scene: Phaser.Scene, options?: HeroOptions) {
    super(scene, 400, 400)
    scene.add.existing(this)
    if(options) this.options = options
    if(this.options.projectSide === PROJECT_SIDE.CLIENT) {
      this.createSprite(scene, Hero.SIZES)
      this.add(this.sprite)
    }
    this.currentState = this.getInitialState()

    scene.physics.add.existing(this)
    // @ts-ignore find out why
    this.body.setSize(Hero.COLLIDER_SQUARE.w, Hero.COLLIDER_SQUARE.h)
  }

  public static createAnimations(scene: Phaser.Scene): void {
    createAnimations(scene)
  }

  public setAnimation (animation: string = 'idle') {
    this.currentState.currentAnimation = animation;
    //if(this.options.projectSide === PROJECT_SIDE.SERVER) return
    if (!this.sprite.anims.isPlaying) this.sprite.play(animation)
    else if (this.sprite.anims.isPlaying && this.sprite.anims.getCurrentKey() !== animation) this.sprite.play(animation)
  }

  private createSprite(scene: Phaser.Scene, size: Size): void {
    const sprite = new Phaser.Physics.Arcade.Sprite(scene, -Hero.COLLIDER_SQUARE.x,-Hero.COLLIDER_SQUARE.y, SKINS.DUDE.toString())
    scene.add.existing(sprite)
    //scene.physics.add.existing(sprite)
    sprite.setOrigin(0)
    sprite.setFrame(0)
    //sprite.setSize(size.w, size.h)
    this.sprite = sprite;
  }

  private getInitialState(): HeroState {
    return {
      stateID:0,
      health: 100,
      speed: 7,
      stamina: 100,
      isDeadObject: false,
      currentAnimation: 'idle',
      currentTarget: undefined
    }
  }

  public setMoveTarget({x, y}: {x:number, y: number}) {
    this.currentState.currentTarget = {x, y}
  }

  public getSyncObject() {
    return {
      ...this.options,
      ...this.currentState,
      x: this.x,
      y: this.y
    }
  }

  private setNewPosition() {
    this.setPosition(Phaser.Math.RND.integerInRange(0, 1000), Phaser.Math.RND.integerInRange(100, 300))
  }

  update() {
    if(this.currentState.currentTarget) {
      const heroVector = new Phaser.Math.Vector2(this.x, this.y)
      const targetVector = new Phaser.Math.Vector2(this.currentState.currentTarget.x, this.currentState.currentTarget.y)
      const moveVector = targetVector.clone().subtract(heroVector)
      const angle = moveVector.angle()
      const distance = heroVector.distance(targetVector);
      let moveDistance = this.currentState.speed;
      if(distance > moveDistance/2) {
        const movePoint = heroVector.setToPolar(angle, moveDistance);
        console.log(this.body)
        //this.setPosition(this.x + movePoint.x, this.y + movePoint.y);
        // @ts-ignore find out why
        this.body.setVelocity(movePoint.x * 30, movePoint.y * 30)
        this.setAnimation(this.getDestinationString(angle))
      } else {
        // @ts-ignore find out why
        this.body.setVelocity(0, 0)
        this.setAnimation('idle')
      }
    }
  }

  private getDestinationString(angle: number) {
    if(angle > 5.886 || angle <= 0.392) return 'right'
    if(angle > 0.392 && angle <= 1.178) return 'downright'
    if(angle > 1.178 && angle <= 1.962) return 'down'
    if(angle > 1.962 && angle <= 2.746) return 'downleft'
    if(angle > 2.746 && angle <= 3.532) return 'left'
    if(angle > 3.532 && angle <= 4.316) return 'upleft'
    if(angle > 4.316 && angle <= 5.102) return 'up'
    if(angle > 5.102 && angle <= 5.886) return 'upright'
  }

  private postUpdate() {
    // this.stateHistory.push({ ...this.currentState })
  }
}

