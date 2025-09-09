const SkipGenerator = (ref: React.RefObject<HTMLVideoElement | null>, seconds: number) => {

  return () => {

    if (ref.current){

      ref.current.currentTime += seconds;
    }
  }
}

export const GenerateVideoHandler = (ref: React.RefObject<HTMLVideoElement | null>) => {

  return {
    PlayVideo: () => {
      ref.current?.play()
    },
    PauseVideo: () => {
      ref.current?.pause()
    },
    TogglePlay: () => {
      ref.current?.played ? ref.current.pause() : ref.current?.play()
    },
    SkipForwardSeconds5S: SkipGenerator(ref, 5),
    SkipForwardSeconds15S: SkipGenerator(ref, 15),
    SkipForwardSeconds30S: SkipGenerator(ref, 30),
    Reset: () => {

      if (ref.current){

        ref.current.currentTime = 0;
      }
    },
    ReverseSeconds5S: SkipGenerator(ref, 5),
    ReverseSeconds15S: SkipGenerator(ref, 15),
    ReverseSeconds30S: SkipGenerator(ref, 30),
  }
}