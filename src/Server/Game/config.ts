import 'phaser'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.HEADLESS,
  parent: 'phaser-game',
  width: 1280,
  height: 720,
  banner: false,
}
export default config

export const arcadePhysics = {
  default: 'arcade',
  arcade: {
    gravity: { y: 0 }
  }
}
