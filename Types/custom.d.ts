declare namespace Phaser {
  namespace Physics {}
}

interface Window {
  game: Phaser.Game
}

interface Socket extends SocketIOClient.Socket {
  join: (roomId: string) => {}
  leave: (roomId: string) => {}
  scene: Phaser.Scene
  id: string
  clientId: number
  room: string
}

declare const PHYSICS_DEBUG: boolean

interface Latency {
  current: number
  high: number
  low: number
  ping: number
  id: string
  canSend: boolean
  history: any[]
}

declare type Square = { x: number; y: number, w: number; h: number}
declare type Size = { w: number; h: number}