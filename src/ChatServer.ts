import * as express from 'express'
import * as socketIO from 'socket.io'
import { createServer, Server } from 'http'

import { ChatEvent } from './constants'
import { setupListener } from './socket/message-service'

export class ChatServer {
  public static readonly PORT: number = 8080
  private _app: express.Application
  private server: Server
  private io: SocketIO.Server
  private port: string | number

  constructor() {
    this._app = express()
    this.port = process.env.PORT || ChatServer.PORT
    this.server = createServer(this._app)
    this.initSocket()
    this.listen()
  }

  private initSocket(): void {
    this.io = socketIO(this.server)
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s.', this.port)
    })
    this.io.on(ChatEvent.CONNECT, (socket: socketIO.Socket) => {
      console.log('Connected client on port %s', this.port)

      setupListener(socket, this.io)

      socket.on(ChatEvent.LEAVECHAT, () => {
        console.log('Client diconnected')
      })
    })

    const startGracefulShutdown = () => {
      console.log('Starting shutdown of express...')
      this.server.close(function() {
        console.log('Express shut down')
      })
    }

    process.on('SIGTERM', startGracefulShutdown)
    process.on('SIGINT', startGracefulShutdown)
  }

  get app(): express.Application {
    return this._app
  }
}
