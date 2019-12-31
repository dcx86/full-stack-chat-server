import { Server, Socket } from 'socket.io'

import { ChatEvent } from '../constants'
import { ChatMessage } from '../types'
import { addUser, getUser, getActiveUsers } from '../utils/users'
import { generateMessage } from '../utils/messages'

const room = 'MAIN_CHAT_ROOM'

export function setupListener(socket: Socket, io: Server) {
  socket.on(ChatEvent.JOIN, (nickname: string, callback: (error: string) => void) =>
    joinChat(socket, io, nickname, callback)
  )
  socket.on(ChatEvent.MESSAGE, (message: ChatMessage) => sendMessage(socket, io, message))
}

function joinChat(socket: Socket, io: Server, nickname: string, callback: (error: string) => void) {
  const { error, user } = addUser({ id: socket.id, username: nickname })

  if (error) return callback(error)

  socket.join(room)

  socket.emit('message', generateMessage({ username: 'Bot', message: 'Welcome!' }))
  socket.broadcast
    .to(room)
    .emit(
      'message',
      generateMessage({ username: 'Bot', message: `${user.username} has join the chat!` })
    )

  io.to(room).emit('roomData', { room, users: getActiveUsers() })

  callback('')
}

function sendMessage(socket: Socket, io: Server, message: ChatMessage) {
  const user = getUser(socket.id)
  io.emit('message', generateMessage(message))
}
