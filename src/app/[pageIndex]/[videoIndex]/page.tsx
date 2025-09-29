import { VideoViewer } from "./VideoViewer.tsx";

const Video: React.FC<{
  params: Promise<{
    pageIndex: number,
    videoIndex: number
  }>
}> =  async ({
  params
}) => {

  const {
    pageIndex,
    videoIndex
  } = await params;

  return (
    <VideoViewer
      pageIndex={pageIndex}
      videoIndex={videoIndex}/>
  )
}

export default Video;