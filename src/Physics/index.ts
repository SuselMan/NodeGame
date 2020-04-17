import Game from './game'

// mock the socket.io
const ioMock = {
  // tslint disable-next-line
  emit: () => console.info('io emit mocked'),
  on: () => console.info('io on mocked'),
  in: () => console.info('io in mocked'),
  connected: 'connected'
}

window.addEventListener('load', () => {
  // @ts-ignore
  window.game = Game(ioMock)
})
