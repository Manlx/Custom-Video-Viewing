import { GetPagesAndVideos } from "@/helpers";
import { VideoPaginator } from "./VideoPagination";

const pages = GetPagesAndVideos('D:/Screen Recording AMD/public/')

export default function Video() {
  return (
    <VideoPaginator pages={pages}></VideoPaginator>
  )
}
//ffmpeg -hwaccel d3d11va -i "Hell Let Loose_replay_2025.01.18-01.39.mp4" -c:v h264_amf -crf 1 -c:a copy output2.mp4