import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;

export function connectToFactorUpdates(sessionId, callback) {
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/factors/${sessionId}`, message => {
      const payload = JSON.parse(message.body);
      callback(payload);
    });
  });
}

export function disconnectFactorSocket() {
  if (stompClient) {
    stompClient.disconnect();
  }
}
