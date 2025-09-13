"use client"

import { createContext, useContext, useEffect, useState } from 'react';

import { useWebSocket, type useWebSocketReturn } from './hooks/useWebSocket.ts';
import { Config } from './../config.ts';

export const WebSocketContext = createContext<{
  webSocketEvents: NetworkTypes.HandleWebSocketEventObject;
  setWebSocketEvents: React.Dispatch<React.SetStateAction<NetworkTypes.HandleWebSocketEventObject>>;
  webSocketRes: useWebSocketReturn;
}>({
  webSocketEvents: {},
  setWebSocketEvents: ()=>{},
  webSocketRes: {
    webSocket: null,
    resetSocket: () => {},
    socketState: 'Closed'
  }
})

export const Providers: React.FC<React.PropsWithChildren> = ({
  children
}) => {

  const [socketURL,setSocketURL] = useState('')
  
  const [webSocketEvents, setWebSocketEvents] = useState<NetworkTypes.HandleWebSocketEventObject>({})
  
  const webSocketRes = useWebSocket(socketURL, webSocketEvents)

  const [contextState, setContextState] = useState({
    webSocketEvents,
    setWebSocketEvents,
    webSocketRes,
  })

  useEffect(()=>{
    setContextState({
      setWebSocketEvents: setWebSocketEvents,
      webSocketEvents: webSocketEvents,
      webSocketRes: webSocketRes
    })
  },[
    webSocketEvents,
    setWebSocketEvents,
    webSocketRes
  ])
  
  useEffect(()=>{

    setSocketURL(`ws://${window.location.hostname}:${Config.WebSocketServerPort}`)
  },[]);


  return (
    <>
      <WebSocketContext.Provider value={contextState}>

        {children}
      </WebSocketContext.Provider>
    </>
  )
}