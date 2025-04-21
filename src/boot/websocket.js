import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

let stompClient = null

export function connectWebSocket(sessionId, onMessageCallback) {
  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws', // адрес сокет-сервера
    reconnectDelay: 3000,
    onConnect: () => {
      console.log('✅ WebSocket connected')
      stompClient.subscribe(`/topic/factors/${sessionId}`, message => {
        const data = JSON.parse(message.body)
        onMessageCallback(data)
      })
    }
  })

  stompClient.activate()
}

export function sendFactor(sessionId, factor) {
  if (!stompClient) return
  stompClient.publish({
    destination: '/app/factor.add',
    body: JSON.stringify({ ...factor, sessionId })
  })
}
