'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { VideoViewerGuest } from "./VideoViewerGuest.tsx";
import { Suspense } from "react";

const Video: React.FC =  () => {

  const router = useRouter()
  const searchParams = useSearchParams();

  const lobbyId = searchParams.get('lobbyId')

  if (!lobbyId){

    router.back();
    return;
  }

  return (

    <Suspense fallback={<div>Loading search results...</div>}>

      <VideoViewerGuest
        lobbyId={lobbyId}/>
    </Suspense>
  )
}

export default Video;