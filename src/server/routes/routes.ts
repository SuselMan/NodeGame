import express from 'express'
import pidusage from 'pidusage'
import path from 'path'
import RoomManager from '../managers/roomManager'

export default class Routes {
  router: express.Router
  time = new Date()

  constructor(public roomManager: RoomManager) {
    this.router = express.Router()

    this.router.get('/', (req, res) => {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Phaser 3: Multiplayer Example</title>
        </head>
        <body>
          <style>
            body {
              font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
            }
            a {
              display: inline-block;
              margin: 0px 8px 8px 0px;
              cursor: pointer;
              padding: 16px;
              background-color: bisque;
              text-decoration: none;
              color: black;
              border-radius: 5px;
            }
            a:hover {
              background-color: #ffc683;
            }
          </style>
          <h1>Phaser 3: Real-Time Multiplayer Game with Physics</h1>
          <a href="/play">Play the Game</a>
        </body>`)
    })

    this.router.get('/play', (req, res) => {
      res.sendFile(path.join(__dirname, '../../dist/client/index.html'))
    })

    this.router.get('/physics', (req, res) => {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Document</title>
        </head>
        <body>
          <style>
            body {
              font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
            }
            li {
              line-height: 3;
            }
          </style>
          <ul>
            <li><a href="/arcade">Debug Arcade Physics</a></li>
          </ul>
        </body>`)
    })

    this.router.get('/arcade', (req, res) => {
      res.sendFile(path.join(__dirname, '../../dist/physics/index.html'))
    })
  }
}
