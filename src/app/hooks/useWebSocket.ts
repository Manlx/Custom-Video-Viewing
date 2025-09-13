import { NetworkHandler } from "@/NetworkHandler";
import { useEffect, useState } from "react"

type socketState = 'Closed' | 'Open'

export type useWebSocketReturn = {
  webSocket: WebSocket | null,
  resetSocket: () => void,
  socketState: socketState
}

function isValidWebSocketUrl(url: string) {
  
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.protocol === 'ws:' || parsedUrl.protocol === 'wss:';

  } catch {
    
    return false;
  }
}

export const useWebSocket = (socketURL: string, events: NetworkTypes.HandleWebSocketEventObject): useWebSocketReturn => {

  const [websocket, setWebSocket] = useState<WebSocket | null>(() => {

    if (isValidWebSocketUrl(socketURL)){

      return new WebSocket(socketURL)
    }

    return null

  });

  const [selfState, setSelfState] = useState<useWebSocketReturn>({
    webSocket: websocket,
    resetSocket: () => {

      setWebSocket(new WebSocket(socketURL))
    },
    socketState: 'Closed'
  }) 

  useEffect(()=>{
    setSelfState(prev => ({...prev, resetSocket: () => {
      setWebSocket(new WebSocket(socketURL))
    }}))
  },[socketURL])

  useEffect(()=>{

    if (!websocket){

      return;
    }
    
    const webSocketCleanup = NetworkHandler.handleWebSocket(websocket, events)

    const onClose: (this: WebSocket, ev: CloseEvent) => void = function (){
    
      setSelfState(prev => ({...prev, socketState: 'Closed'}))
    }

    const onOpen: (this: WebSocket, ev: Event) => void = function (){
    
      setSelfState(prev => ({...prev, socketState: 'Open'}))
    }
    
      websocket.addEventListener('close', onClose)
      websocket.addEventListener('open', onOpen)

    return () => {

      websocket.removeEventListener('close', onClose)
      websocket.removeEventListener('open', onOpen)

      if (webSocketCleanup){
        
        webSocketCleanup()
      }
    }
  },[
    websocket,
    events
  ])

  return selfState
}