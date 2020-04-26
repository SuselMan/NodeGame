import PreloadScene from './Scenes/PreloadScene'
import MenuScene from './Scenes/MenuScene'
import GameScene from './Scenes/GameScene'

const DEFAULT_WIDTH = document.documentElement.clientWidth
const DEFAULT_HEIGHT = document.documentElement.clientHeight

// the size of the world
export const world = {
  x: 0,
  y: 0,
  width: 2560,
  height: 2560
}

const config = {
  type: Phaser.WEBGL,
  backgroundColor: '#6D6A28',
  width: DEFAULT_WIDTH, // initial width that determines the scaled size
  height: DEFAULT_HEIGHT,
  scene: [PreloadScene, MenuScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: true,
      debugBodyColor: 0xff00ff
    }
  }
}
export default config
