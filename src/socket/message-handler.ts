import { ChatEvent } from '../constants'
import { ChatMessage } from '../types'

export const setupOnMessageListner = (socket: any, io: any) => {
  socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
    console.log('[server](message): %s', JSON.stringify(m))
    io.emit('message', m)
  })
}
