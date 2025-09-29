import { VideoPaginator } from "./VideoPagination";
import { Suspense } from "react";

export default function Video() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>

      <VideoPaginator></VideoPaginator>
    </Suspense>
  )
}
//ffmpeg -hwaccel d3d11va -i "Hell Let Loose_replay_2025.01.18-01.39.mp4" -c:v h264_amf -crf 1 -c:a copy output2.mp4