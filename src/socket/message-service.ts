import { Server, Socket } from 'socket.io'

import { ChatEvent } from '../constants'
import { ChatMessage } from '../types'

export function setupListener(socket: Socket, io: Server) {
  socket.on(ChatEvent.MESSAGE, (data: ChatMessage) => receiveMessage(io, data))
}

function receiveMessage(io: Server, data: ChatMessage) {
  io.emit('message', data)
}
