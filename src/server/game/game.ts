import '@geckos.io/phaser-on-nodejs'
import commonConfig, { arcadePhysics } from './config'

import ArcadeScene from './scenes/arcadeScene'
import RoomManager from '../managers/roomManager'

export class PhaserGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

const Game = (roomManager: RoomManager, roomId: string, options: { scene: string; level: number }) => {
  const config = { ...commonConfig }

  if (options.scene === 'ArcadeScene') {
    config.scene = [ArcadeScene]
    config.physics = arcadePhysics
  }

  // @ts-ignore
  config.customEnvironment = true

  // a very hackie trick to pass some custom data
  // but it work well :)
  config.callbacks = {
    preBoot: () => {
      return { level: +options.level, roomManager, roomId }
    }
  }

  return new PhaserGame(config)
}
export default Game
