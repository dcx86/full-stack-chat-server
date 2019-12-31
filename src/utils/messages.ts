import { ChatMessage } from '../types'

export const generateMessage = (data: ChatMessage) => {
  const { username, message } = data
  return {
    username: username.toString(),
    message: message.toString(),
    createdAt: new Date().getTime()
  }
}
