"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation';
import { WebSocketContext } from "./Providers.tsx"

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

  const webSocketContext = useContext(WebSocketContext);

  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [lobbyId,setLobbyId] = useState('')

  useEffect(()=>{

    webSocketContext.setWebSocketEvents(prevEvents => ({
      ...prevEvents,
      LobbyCreated(context){

        setLobbyId(context.lobbyId)
      },
      RequestSync(context){

        if (!videoRef.current){

          return;
        }

        this.send(JSON.stringify({
          messageType: 'HostLobbySyncResponse',
          hostCurrentState: {
            currentVideoTime: videoRef.current.currentTime ?? 0,
            currentSrc: videoRef.current.currentSrc,
            paused: videoRef.current.paused,
            playBackSpeed: videoRef.current.playbackRate
          }
        } satisfies NetworkTypes.WebSocketMessagesObject['HostLobbySyncResponse']))
      },
      LobbySyncResponse(context){

        console.log(context)

        if (!videoRef.current){

          return;
        }

        videoRef.current.currentTime = context.hostCurrentState.currentVideoTime
        videoRef.current.src = context.hostCurrentState.currentSrc
        videoRef.current.playbackRate = context.hostCurrentState.playBackSpeed

        if (context.hostCurrentState.paused) {

          videoRef.current.pause()
        }
        else {
          videoRef.current.play()
        }
      }
    }))
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
          src={`${folder}/${videoName}`} 
          type="video/mp4"/>
          
      </video>

      <div>
        
      </div>

      <span>

        <button
          disabled={webSocketContext.webSocketRes.socketState === 'Closed'}
          onClick={()=>{

            webSocketContext.webSocketRes.webSocket?.send(JSON.stringify({
              messageType: 'CreateLobby'
            } satisfies NetworkTypes.WebSocketMessagesObject['CreateLobby']))
          }}>Request Lobby Creation</button>
      </span>

      { webSocketContext.webSocketRes.socketState === 'Closed' &&

        <button
          onClick={()=>{

            webSocketContext.webSocketRes.resetSocket()
          }}>Reconnect</button>
      }
      <p>Socket State: {webSocketContext.webSocketRes.socketState}</p>
    </div>
  )
}