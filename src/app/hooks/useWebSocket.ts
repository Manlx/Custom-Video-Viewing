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

  const [selfState, setSelfState] = useState<useWebSocketReturn>(() => ({
    webSocket: isValidWebSocketUrl(socketURL) ? new WebSocket(socketURL) : null,
    resetSocket: () => {

      setSelfState(prev => ({...prev, webSocket: new WebSocket(socketURL)}))
    },
    socketState: 'Closed'
  })) 

  useEffect(()=>{
    setSelfState(prev => ({...prev, resetSocket: () => {

      setSelfState(prev => ({...prev, webSocket: new WebSocket(socketURL)}))
    }}))
  },[socketURL])

  useEffect(()=>{

    if (!selfState.webSocket){

      return;
    }
    
    const webSocketCleanup = NetworkHandler.handleWebSocket(selfState.webSocket, events)

    const onClose: (this: WebSocket, ev: CloseEvent) => void = function (){
    
      setSelfState(prev => ({...prev, socketState: 'Closed'}))
    }

    const onOpen: (this: WebSocket, ev: Event) => void = function (){
    
      setSelfState(prev => ({...prev, socketState: 'Open'}))
    }
    
      selfState.webSocket.addEventListener('close', onClose)
      selfState.webSocket.addEventListener('open', onOpen)

    return () => {

      if (!selfState.webSocket){

        return;
      }

      selfState.webSocket.removeEventListener('close', onClose)
      selfState.webSocket.removeEventListener('open', onOpen)

      if (webSocketCleanup){
        
        webSocketCleanup()
      }
    }
  },[
    selfState.webSocket,
    events
  ])

  return selfState
}