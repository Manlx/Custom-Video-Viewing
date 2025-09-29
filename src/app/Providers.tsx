"use client"

import { createContext, useEffect, useState } from 'react';

import { useWebSocket } from './hooks/useWebSocket.ts';
import { Config } from './../config.ts';

export const WebSocketContext = createContext<WebSocketContextType>({
  webSocketEvents: {},
  setWebSocketEvents: ()=>{},
  webSocketRes: {
    webSocket: null,
    resetSocket: () => {},
    socketState: 'Closed'
  },
  videoData: [],
  setVideoData: () => {}
})

export const Providers: React.FC<React.PropsWithChildren<{
  videoDataFromServer: PageAndVideos[]
}>> = ({
  children,
  videoDataFromServer = []
}) => {

  const [socketURL,setSocketURL] = useState('')
  
  const [webSocketEvents, setWebSocketEvents] = useState<NetworkTypes.HandleWebSocketEventObject>({})
  
  const [videoData, setVideoData] = useState<PageAndVideos[]>(videoDataFromServer)
  
  const webSocketRes = useWebSocket(socketURL, webSocketEvents)

  const [contextState, setContextState] = useState<WebSocketContextType>({
    webSocketEvents,
    setWebSocketEvents,
    webSocketRes,
    videoData: videoData,
    setVideoData: setVideoData
  })

  useEffect(()=>{
    setContextState({
      setWebSocketEvents: setWebSocketEvents,
      webSocketEvents: webSocketEvents,
      webSocketRes: webSocketRes,
      videoData: videoData,
      setVideoData: setVideoData
    })
  },[
    webSocketEvents,
    setWebSocketEvents,
    webSocketRes,
    videoData,
    setVideoData
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