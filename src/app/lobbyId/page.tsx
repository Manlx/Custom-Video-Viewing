'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { VideoViewerGuest } from "./VideoViewerGuest.tsx";

const Video: React.FC =  () => {

  const router = useRouter()
  const searchParams = useSearchParams();

  const lobbyId = searchParams.get('lobbyId')

  if (!lobbyId){

    router.back();
    return;
  }

  return (
    <VideoViewerGuest
      lobbyId={lobbyId}/>
  )
}

export default Video;