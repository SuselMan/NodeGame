import { SKINS } from '../../constants'

export const createDudeAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'up',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 0, end: 15 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'down',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 16, end: 31 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 32, end: 47 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 48, end: 63 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'upleft',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 64, end: 79 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'upright',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start:  80, end: 95 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'downleft',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 96, end: 111 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'downright',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 112, end: 127 }),
    frameRate: 30,
    repeat: -1
  })

  scene.anims.create({
    key: 'idle',
    frames: [{ key: SKINS.DUDE.toString(), frame: 20 }],
    frameRate: 30
  })
}

export const setDudeAnimation = (sprite: Phaser.GameObjects.Sprite, animation: string = 'idle') => {
  if (!sprite.anims.isPlaying) sprite.play(animation)
  else if (sprite.anims.isPlaying && sprite.anims.getCurrentKey() !== animation) sprite.play(animation)
}
