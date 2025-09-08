"use client"

import { useEffect, useRef, useState } from "react"
import { useWebSocket } from "./hooks/useWebSocket"

export const VideoViewer: React.FC<{
  folder: string, 
  videoName: string
}> = ({
  folder,
  videoName
}) => {

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)

  const [
    webSocket,
    socketData,
    resetSocket,
    socketState
  ] = useWebSocket('ws://localhost:8080')

  useEffect(()=>{
    try {
      const wsObject = JSON.parse(socketData)

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
        <button
          onClick={()=>{

            if (!videoRef.current){

              return;
            }

            if (isPlaying) {

              videoRef.current.pause();
              setIsPlaying(false);
              
              return;
            }

            videoRef.current.play();
            setIsPlaying(true)

          }}>Pause/Play</button>

        <button
          onClick={()=>{

            if (!videoRef.current){

              return;
            }

            videoRef.current.requestFullscreen();

          }}>Fullscreen</button>
      </div>

      <button
        onClick={()=>{

          webSocket.send(JSON.stringify({
            message: 'CreateVideoWatchTogetherLobby'
          } satisfies NetworkTypes.CreateLobby))
        }}>Send Play Request</button>

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