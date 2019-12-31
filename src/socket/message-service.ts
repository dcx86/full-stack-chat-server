import { Server, Socket } from 'socket.io'

import { ChatEvent } from '../constants'
import { ChatMessage } from '../types'
import { addUser, removeUser } from '../utils/users'
import { generateMessage } from '../utils/messages'

export function setupListener(socket: Socket, io: Server) {
  socket.on(ChatEvent.JOIN, (nickname: string, callback: (error: string) => void) =>
    joinChat(socket, io, nickname, callback)
  )
  socket.on(ChatEvent.MESSAGE, (message: ChatMessage) => sendMessage(socket, io, message))
  socket.on(ChatEvent.DISCONNECT, () => leaveChat(socket, io))
}

function joinChat(socket: Socket, io: Server, nickname: string, callback: (error: string) => void) {
  const { error, user } = addUser({ id: socket.id, username: nickname })

  if (error) return callback(error)

  io.emit(
    'message',
    generateMessage({ username: 'Bot', message: `${user.username} has join the chat!` })
  )

  callback('')
}

function leaveChat(socket: Socket, io: Server) {
  const user = removeUser(socket.id)
  if (user) {
    io.emit(
      'message',
      generateMessage({ username: 'Bot', message: `${user.username} has left the chat!` })
    )
  }
}

function sendMessage(socket: Socket, io: Server, message: ChatMessage) {
  io.emit('message', generateMessage(message))
}
