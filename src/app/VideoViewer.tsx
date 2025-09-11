"use client"

import React, { useEffect, useRef, useState } from "react"
import { useWebSocket } from "./hooks/useWebSocket"
import { Config } from "./../config.ts"
import { NetworkTypesProofs } from "./sharedTypes/proofs"
import { useRouter } from 'next/navigation';

// ToDo network sided buttons for host.
// const controls: VideoControlOptions[] = ['PauseVideo','TogglePlay', 'PlayVideo','Reset', 'ReverseSeconds30S', 'ReverseSeconds15S','ReverseSeconds5S','SkipForwardSeconds5S', 'SkipForwardSeconds15S','SkipForwardSeconds30S']

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

export const VideoViewer: React.FC<{
  folder: string, 
  videoName: string
}> = ({
  folder,
  videoName
}) => {

  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [socketURL,setSocketURL] = useState('')

  const [lobbyId,setLobbyId] = useState('')

  useEffect(()=>{

    setSocketURL(`ws://${window.location.hostname}:${Config.WebSocketServerPort}`)
  },[])

  const [
    webSocket,
    socketData,
    resetSocket,
    socketState
  ] = useWebSocket(socketURL)

  console.log(webSocket)

  useEffect(()=>{

    if (!socketData) {

      return;
    }

    try {
      const wsObject = JSON.parse(socketData)

      if (NetworkTypesProofs.LobbyCreated(wsObject)){

        setLobbyId(wsObject.lobbyId)
      }

    } catch (error) {
      
      console.error(error)
    }

  },[
    socketData
  ])

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
          src={`${folder}/${videoName}`} 
          type="video/mp4"/>
          
      </video>

      <div>
        
      </div>

      <span>

        <button
          onClick={()=>{

            webSocket?.send(JSON.stringify({
              type: 'CreateLobby'
            } satisfies NetworkTypes.CreateLobby))
          }}>Request Lobby Creation</button>

        <button
          onClick={()=>{

            const lobbyId = prompt('Lobby Id: ')

            if (!lobbyId) {

              alert('No lobby id provided')
              
              return;
            }
            webSocket?.send(JSON.stringify({
              type: 'JoinLobby',
              lobbyId: lobbyId
            } satisfies NetworkTypes.JoinLobby))
          }}>Request Join Lobby</button>
      </span>

      <p>socketData: {socketData}</p>

      { socketState === 'Closed' &&

        <button
          onClick={()=>{

            resetSocket()
          }}>Reconnect</button>
      }
      <p>Socket State: {socketState}</p>
    </div>
  )
}