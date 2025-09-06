import {execSync} from "child_process"

export const GetAllVideoFiles = (source: string) =>  {

  return execSync("cd public &&  dir /A-D /S /B", {encoding :'utf8'}).split('\r\n').filter(line => line.endsWith('.mp4')).map(line => line.replaceAll('\\','/').replace(source, '')).filter(line => !line.includes('replay_cache'))
}

export const GetAllVideoPerFolder = (folder: string, source: string ) => {

  return execSync(`cd ${folder} &&  dir /A-D /S /B`, {encoding :'utf8'}).split('\r\n').filter(line => line.endsWith('.mp4')).map(line => line.replaceAll('\\','/').replace(source, '')).filter(line => !line.includes('replay_cache'))
}

export const GetPagesAndVideos = (source: string) => {

  const dirs: string[] = execSync('cd public && dir /AD /B', {encoding: 'utf8'}).split('\r\n').filter(folder => folder.length > 0).filter(line => !line.includes('replay_cache'))

  const pages:{
    pageName: string,
    videos: string[]
  }[] = dirs.map(dir => ({
    pageName: dir,
    videos: GetAllVideoPerFolder(`./public/${dir}`,source)
  }))

  return pages;
}