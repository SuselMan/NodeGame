import '@geckos.io/phaser-on-nodejs'
import commonConfig, { arcadePhysics } from './config'

import ArcadeScene from './Scenes/GameScene'
import RoomManager from '../Managers/roomManager'

const Game = (roomManager: RoomManager, roomId: string, options: { scene: string; level: number }) => {
  const config = { ...commonConfig }

  if (options.scene === 'ArcadeScene') {
    config.scene = [ArcadeScene]
    config.physics = arcadePhysics
  }

  // @ts-ignore
  config.callbacks = {
    preBoot: (): { roomManager: RoomManager, roomId: string } => {
      return { roomManager, roomId }
    }
  }

  return new Phaser.Game(config)
}
export default Game
