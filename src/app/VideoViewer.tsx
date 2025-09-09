"use client"

import { useEffect, useRef, useState } from "react"
import { useWebSocket } from "./hooks/useWebSocket"
import Link from "next/link"
import { GenerateVideoHandler } from "./VideoHandler"
import { Config } from "@/config.ts"
import { NetworkTypesProofs } from "./sharedTypes/proofs"

const controls: VideoControlOptions[] = ['PauseVideo','TogglePlay', 'PlayVideo','Reset', 'ReverseSeconds30S', 'ReverseSeconds15S','ReverseSeconds5S','SkipForwardSeconds5S', 'SkipForwardSeconds15S','SkipForwardSeconds30S']

export const VideoViewer: React.FC<{
  folder: string, 
  videoName: string
}> = ({
  folder,
  videoName
}) => {

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)

  const [socketURL,setSocketURL] = useState('')

  const [lobbyId,setLobbyId] = useState('')

  useEffect(()=>{

    setSocketURL(`ws://${window.location.hostname}:${Config.WebSocketServerPort}`)
  })

  const [
    webSocket,
    socketData,
    resetSocket,
    socketState
  ] = useWebSocket(socketURL)

  console.log(webSocket)

  useEffect(()=>{

    console.log(socketData)
    try {
      const wsObject = JSON.parse(socketData)

      if (NetworkTypesProofs.LobbyCreated(wsObject)){

        setLobbyId(wsObject.lobbyId)
      }

    } catch (error) {
      
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
        height: '100%',
        flexDirection: 'column',
        gap: '1rem'
      }}> 
      <div>
        <Link 
          style={{
            textDecoration: 'none',
            color: 'cyan',
            fontSize: '3rem'
          }}
          href={'/'}>
          Home
        </Link>
        <p>Lobby Id: {lobbyId}</p>
      </div>
      <video 
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

      <button
        onClick={()=>{

          webSocket?.send(JSON.stringify({
            message: 'CreateVideoWatchTogetherLobby'
          } satisfies NetworkTypes.CreateLobby))
        }}>Request Lobby Creation</button>

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