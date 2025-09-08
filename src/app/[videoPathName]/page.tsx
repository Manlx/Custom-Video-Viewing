import { VideoViewer } from "../VideoViewer";

const Video: React.FC<{
  params: Promise<{
    videoPathName: string
  }>
}> =  async ({
  params
}) => {

  const {
    videoPathName
  } = await params;

  const [
    folder,
    videoNameWithExtension
  ] = decodeURIComponent(videoPathName).split('/')

  const videoName = videoNameWithExtension.replace('.watchTogether', '')

  return (
    <VideoViewer
      folder={folder}
      videoName={videoName}></VideoViewer>
  )
}

export default Video;