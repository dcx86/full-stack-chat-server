import { ChatMessage } from '../types'

export const generateMessage = (data: ChatMessage) => {
  const { username, message } = data
  return {
    username,
    message,
    createdAt: new Date().getTime()
  }
}
