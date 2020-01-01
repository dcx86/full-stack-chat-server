import { Server, Socket } from 'socket.io'

import { ChatEvent } from '../constants'
import { ChatMessage } from '../types'
import { addUser, removeUser, setUserTimerId, getUserTimerId, getUser } from '../utils/users'
import { generateMessage } from '../utils/messages'

const maximumInactiveTime = 60 * 1000

export function setupListener(socket: Socket, io: Server) {
  socket.on(ChatEvent.JOIN, (nickname: string, callback: (error: string) => void) =>
    joinChat(socket, io, nickname, callback)
  )
  socket.on(ChatEvent.MESSAGE, (message: ChatMessage) => sendMessage(socket, io, message))
  socket.on(ChatEvent.LEAVECHAT, (m: string) => leaveChat(socket, io, m))
  socket.on(ChatEvent.DISCONNECT, () => disconnect(socket, io))
}

function joinChat(socket: Socket, io: Server, nickname: string, callback: (error: string) => void) {
  const { error, user } = addUser({ id: socket.id, username: nickname.toString() })

  if (error) return callback(error)

  io.emit(
    'message',
    generateMessage({ username: 'Bot', message: `${user.username} has join the chat!` })
  )

  callback('')
  startTimer(socket, io)
}

function leaveChat(socket: Socket, io: Server, m: string) {
  const user = getUser(socket.id)
  if (user) {
    io.emit('message', generateMessage({ username: 'Bot', message: m.toString() }))
  }
  socket.disconnect(true)
}

function disconnect(socket: Socket, io: Server) {
  const user = getUser(socket.id)
  const message = `${user.username} has lost connection!`
  leaveChat(socket, io, message)
  removeUser(socket.id)
  socket.disconnect(true)
}

function startTimer(socket: Socket, io: Server) {
  const user = getUser(socket.id)
  const m = `${user.username} has been disconnected due to inactivity!`
  const timerId = setTimeout(() => {
    leaveChat(socket, io, m)
  }, maximumInactiveTime)
  setUserTimerId(user.id, timerId)
}

function sendMessage(socket: Socket, io: Server, message: ChatMessage) {
  io.emit('message', generateMessage(message))
  const userId = socket.id
  const timerId = getUserTimerId(userId)
  clearTimeout(timerId)
  startTimer(socket, io)
}
