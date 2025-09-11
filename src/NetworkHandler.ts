import { WebSocket } from 'ws';
import { NetworkTypesProofs } from './app/sharedTypes/proofs';

export class NetworkHandler {

  /**
   * Accepts a WebSocket and then attaches an on message event handler which will run any of the provided functions in the events object with the Message Data associated with that event and the websocket it self.
   */
  static handleWebSocket (newSocket: WebSocket, events: {[key in NetworkTypes.WebSocketMessageEvents['eventName']]?: NetworkTypes.WebSocketMessageEvents['eventFunction']  }) {

    const onMessage: (event: WebSocket.MessageEvent) => void = (event) => {
      
      const eventData = event.data.toString()

      if (!eventData){

        return;
      }

      try {
        
        const messageEventData = JSON.parse(eventData);

        if (!NetworkTypesProofs.WebSocketMessages(messageEventData)) {

          return;
        }

        const callback = events[messageEventData.type];

        if (!callback) {

          return;
        }

        // This is as any as the event keys are linked by the WebSocketMessages.type 
        callback(messageEventData as any, newSocket)
      } catch (error) {
        
        return;
      }
      
    }

    const cleanUp = () => {

      newSocket.removeAllListeners('message')
      newSocket.removeAllListeners('close')
    }

    newSocket.addEventListener('message', onMessage)
    newSocket.addEventListener('close',cleanUp)

  }
}