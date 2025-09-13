"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation';
import { WebSocketContext } from "./../Providers.tsx"
import { ReconnectButton } from "./../ReconnectButton.tsx";

const linkStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100%',
  flexDirection: 'column',
  gap: '1rem',
  cursor: 'default',
  caretColor: 'transparent'
}

export const VideoViewerGuest: React.FC<{
  lobbyId: string
}> = ({
  lobbyId
}) => {

  const webSocketContext = useContext(WebSocketContext);

  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(()=>{

    webSocketContext.setWebSocketEvents(prevEvents => ({
      ...prevEvents,
      LobbySyncResponse(context){

        if (!videoRef.current){

          return;
        }

        videoRef.current.src = context.hostCurrentState.currentSrc
        videoRef.current.currentTime = context.hostCurrentState.currentVideoTime
        videoRef.current.playbackRate = context.hostCurrentState.playBackSpeed

        if (context.hostCurrentState.paused) {

          videoRef.current.pause()
        }
        else {
          videoRef.current.play()
        }
      }
    }))

    webSocketContext.webSocketRes.webSocket?.send(JSON.stringify({
      messageType: 'JoinLobby',
      lobbyId: lobbyId
    } satisfies NetworkTypes.WebSocketMessagesObject['JoinLobby']))
  },[])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        flexDirection: 'column',
        gap: '1rem'
      }}> 
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3rem'
        }}>
        <h1
          style={linkStyle}
         onClick={() => router.back()}>Back</h1>
        <h1
          style={linkStyle}
         onClick={() => router.push('/')}>Home</h1>
        <p>Lobby Id: {lobbyId}</p>
      </div>
      <video
        controls
        ref={videoRef}
        style={{
          height: '70vh',
          width: 'auto',
          borderRadius: '3rem'
        }}
        width={"100%"} 
        preload={"auto"}>

        <source 
          type="video/mp4"/>
          
      </video>

      <ReconnectButton></ReconnectButton>
      <p>Socket State: {webSocketContext.webSocketRes.socketState}</p>
    </div>
  )
}