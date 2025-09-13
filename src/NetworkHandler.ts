import type {
  WebSocket as WebSocketServerConnection
} from "ws"

import { NetworkTypesProofs } from './app/sharedTypes/proofs.ts';

export class NetworkHandler {

  /**
   * Accepts a WebSocket and then attaches an on message event handler which will run any of the provided functions in the events object with the Message Data associated with that event and the websocket it self.
   */
  static handleWebSocket (newSocket: WebSocketServerConnection | WebSocket, events: NetworkTypes.HandleWebSocketEventObject): (()=>void) | undefined {

    const onMessage: ((this: WebSocket, ev: MessageEvent<string>) => any) & ((event: WebSocketServerConnection.MessageEvent) => void) = (event) => {
      
      const eventData = event.data.toString()

      if (!eventData){

        return;
      }

      try {
        
        const messageEventData = JSON.parse(eventData);

        if (!NetworkTypesProofs.WebSocketMessages(messageEventData)) {

          return;
        }

        const callback = events[messageEventData.messageType];

        if (!callback) {

          return;
        }

        if (typeof callback === 'function') {
          
          // This is as any as the event keys are linked by the WebSocketMessages.type 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback.call(newSocket, messageEventData as any)

          return;
        }

        // This is as any as the event keys are linked by the WebSocketMessages.type 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback.forEach( cb => cb.call(newSocket, messageEventData as any)) 
        
        
      } catch {
        
        return;
      }
      
    }

    const cleanUp = () => {

      newSocket.removeEventListener('message', onMessage)
      newSocket.removeEventListener('close',cleanUp)
    }

    newSocket.addEventListener('message', onMessage)
    newSocket.addEventListener('close',cleanUp)

    return cleanUp;
  }
}