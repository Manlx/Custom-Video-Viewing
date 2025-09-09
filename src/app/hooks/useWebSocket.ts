import { useEffect, useState } from "react"

type socketState = 'Closed' | 'Open'

type SocketMessageEvent = MessageEvent<string>

type useWebSocketReturn = [
  webSocket: WebSocket | null,
  socketData: string,
  resetSocket: () => void,
  socketState: socketState
]

function isValidWebSocketUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    // Check if the protocol is 'ws:' for insecure or 'wss:' for secure WebSockets
    return parsedUrl.protocol === 'ws:' || parsedUrl.protocol === 'wss:';
  } catch (error) {
    // The URL constructor throws an error for invalid URL formats
    return false;
  }
}

export const useWebSocket = (socketURL: string): useWebSocketReturn => {

  const [websocket, setWebSocket] = useState<WebSocket | null>(() => {

    if (isValidWebSocketUrl(socketURL)){

      return new WebSocket(socketURL)
    }
    return null

  });

  const [
    socketData,
    setSocketData
  ] = useState('')

  const [
    socketState,
    setSocketState
  ] = useState<socketState>('Closed')

  useEffect(()=>{

    const onMessage: (this: WebSocket, ev: SocketMessageEvent) => void = function (data){
    
      if (typeof data.data === 'string') {

        setSocketData(data.data)
      }
    }

    const onClose: (this: WebSocket, ev: CloseEvent) => void = function (){
    
      setSocketState('Closed')
    }

    const onOpen: (this: WebSocket, ev: Event) => void = function (){
    
      setSocketState('Open')
    }

    websocket?.addEventListener('message', onMessage)

    websocket?.addEventListener('close',onClose)

    websocket?.addEventListener('open', onOpen)

    return () => {

      websocket?.removeEventListener('message', onMessage)
    }
  },[
    websocket
  ])

  return [
    websocket,
    socketData,
    () => {

      setWebSocket(new WebSocket(socketURL))
    },
    socketState
  ] as const
}