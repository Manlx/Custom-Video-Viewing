import {execSync} from "child_process"

export const GetAllVideoFiles = (source: string) =>  {

  return execSync("cd public &&  dir /A-D /S /B", {encoding :'utf8'}).split('\r\n').filter(line => line.endsWith('.mp4') || line.endsWith('.mkv')).map(line => line.replaceAll('\\','/').replace(source, '')).filter(line => !line.includes('replay_cache'))
}

export const GetAllVideoPerFolder = (folder: string, source: string ) => {

  return execSync(`cd ${folder} &&  dir /A-D /S /B`, {encoding :'utf8'}).split('\r\n').filter(line => line.endsWith('.mp4') || line.endsWith('.mkv')).map(line => line.replaceAll('\\','/').replace(source, '')).filter(line => !line.includes('replay_cache'))
}

export const GetAllSubtitlesFiles = (source: string) =>  {

  return execSync("cd public &&  dir /A-D /S /B", {encoding :'utf8'}).split('\r\n').filter(line => line.endsWith('.vtt') ).map(line => line.replaceAll('\\','/').replace(source, '')).filter(line => !line.includes('replay_cache'))
}

export const GetAllSubtitlesPerFolder = (folder: string, source: string ) => {

  return execSync(`cd ${folder} &&  dir /A-D /S /B`, {encoding :'utf8'}).split('\r\n').filter(line => line.endsWith('.vtt') ).map(line => line.replaceAll('\\','/').replace(source, '')).filter(line => !line.includes('replay_cache'))
}

const GetVideoName = (videoPath: string): string => {

  const subPaths = videoPath.split('/').map(subPath => subPath.replace('.mp4','').replace('.mkv', ''))
  
  return subPaths[subPaths.length - 1]
}

export const GetPagesAndVideos = (source: string): PageAndVideos[] => {

  const dirs: string[] = execSync('cd public && dir /AD /B', {encoding: 'utf8'}).split('\r\n').filter(folder => folder.length > 0).filter(line => !line.includes('replay_cache'))

  let pages: PageAndVideos[]  = []

  if (pages.length === 0) {
    
    pages = dirs.map(dir => {

      const videosPaths = GetAllVideoPerFolder(`./public/${dir}`,source)

      const subTitles =  GetAllSubtitlesPerFolder(`./public/${dir}`,source)

      return {
        pageName: dir,
        videoSources: videosPaths.map(videoPath => {

          const currentVideoName = GetVideoName(videoPath)

          return {
            track: videoPath,
            subtitles: subTitles.find(subTitlePath => subTitlePath.includes(currentVideoName))
          } satisfies PageAndVideos['videoSources'][number]
        })
      } satisfies PageAndVideos
    })
  }

  return pages;
}