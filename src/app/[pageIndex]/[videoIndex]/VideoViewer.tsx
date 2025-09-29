"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation';
import { WebSocketContext } from "../../Providers.tsx"
import { ReconnectButton } from "../../ReconnectButton.tsx";

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

let debounceId: NodeJS.Timeout | undefined = undefined;

export const VideoViewer: React.FC<{
  pageIndex: number,
  videoIndex: number
}> = ({
  pageIndex,
  videoIndex
}) => {

  
  const webSocketContext = useContext(WebSocketContext);

  console.log(webSocketContext.videoData[pageIndex].videoSources[videoIndex].track)

  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [lobbyId,setLobbyId] = useState('')

  useEffect(()=>{

    webSocketContext.setWebSocketEvents(prevEvents => ({
      ...prevEvents,
      LobbyCreated(context){

        setLobbyId(context.lobbyId)
      },
      RequestSync(){

        runSyncEvent()
      }
    }))
  },[])

  const runSyncEvent = () => {

    if (!!debounceId){

      clearTimeout(debounceId)
    }

    debounceId = setTimeout(() => {

      if (!videoRef.current || !webSocketContext.webSocketRes.webSocket){
        return;
      }
      
      webSocketContext.webSocketRes.webSocket.send(JSON.stringify({
        messageType: 'HostLobbySyncResponse',
        hostCurrentState: {
          currentVideoTime: videoRef.current.currentTime ?? 0,
          currentSrc: videoRef.current.currentSrc,
          paused: videoRef.current.paused,
          playBackSpeed: videoRef.current.playbackRate,
          textTrackList: videoRef.current.textTracks
        }
      } satisfies NetworkTypes.WebSocketMessagesObject['HostLobbySyncResponse']))

      debounceId = undefined;
    }, 200);
  }

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
        // onClick={runSyncEvent}
        onPlay={runSyncEvent}
        onPause={runSyncEvent}
        onSeeked={runSyncEvent}
        onRateChange={runSyncEvent}
        controls
        ref={videoRef}
        style={{
          height: '70vh',
          width: 'auto',
        }}
        width={"100%"} 
        preload={"auto"}>

        { !!webSocketContext.videoData[pageIndex] &&
          <>
            <source 
              src={`/${webSocketContext.videoData[pageIndex].videoSources[videoIndex].track}`} 
              type="video/mp4"/>

            { !!webSocketContext.videoData[pageIndex].videoSources[videoIndex].subtitles &&

              <track src={`/${webSocketContext.videoData[pageIndex].videoSources[videoIndex].subtitles}`} kind="subtitles" srcLang="en" label="English" />
            }
          </>

        }
          
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
          }}>
          Request Lobby Creation
        </button>
      </span>

      <ReconnectButton></ReconnectButton>
      <p>Socket State: {webSocketContext.webSocketRes.socketState}</p>
    </div>
  )
}