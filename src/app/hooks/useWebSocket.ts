import { useEffect, useState } from "react"

type socketState = 'Closed' | 'Open'

type SocketMessageEvent = MessageEvent<string>

type useWebSocketReturn = [
  webSocket: WebSocket,
  socketData: string,
  resetSocket: () => void,
  socketState: socketState
]

export const useWebSocket = (socketURL: string): useWebSocketReturn => {

  const [websocket, setWebSocket] = useState(() => {

    return new WebSocket(socketURL)
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
    
      if (typeof data === 'string') {

        setSocketData(data)
      }
    }

    const onClose: (this: WebSocket, ev: CloseEvent) => void = function (){
    
      setSocketState('Closed')
    }

    const onOpen: (this: WebSocket, ev: Event) => void = function (){
    
      setSocketState('Open')
    }

    websocket.addEventListener('message', onMessage)

    websocket.addEventListener('close',onClose)

    websocket.addEventListener('open', onOpen)

    return () => {

      websocket.removeEventListener('message', onMessage)
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