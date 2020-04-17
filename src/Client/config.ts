import PreloadScene from './Scenes/preloadScene'
import MenuScene from './Scenes/menuScene'
import MainScene from './Scenes/mainScene'

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
  backgroundColor: '#556539',
  width: DEFAULT_WIDTH, // initial width that determines the scaled size
  height: DEFAULT_HEIGHT,
  scene: [PreloadScene, MenuScene, MainScene],
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
