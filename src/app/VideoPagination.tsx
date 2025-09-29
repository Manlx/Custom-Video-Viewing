"use client"
import { useContext, useEffect, useState } from "react";
import { useRouter,useSearchParams  } from 'next/navigation';
import { WebSocketContext } from "./Providers";
import { ReconnectButton } from "./ReconnectButton";

type VideoPaginatorProps = {
  paginationSize?: number
}

const PaginationSizingOptions: React.FC<{
  min: number,
  max: number
}> = ({
  max,
  min
}) => {

  const options: React.ReactNode[] = [];

  for (let i = min; i <= max; i++) {

    options.push(

      <option 
        key={`value-${i}-with-min-${min}-and-max-${max}`}
        value={i}>
          {i}
      </option>
    )
  }


  return options;
}

export const VideoPaginator: React.FC<VideoPaginatorProps> = ({
  paginationSize: paginationSizeInitial = 6
}) => {

  const searchParams = useSearchParams();
  
  const router = useRouter()

  const 
    currentTabIndexQueryParam = Number(searchParams.get('currentTabIndex')), 
    currentSubPageQueryParam = Number(searchParams.get('currentSubPage'))
    // paginationSizeQueryParam = Number(searchParams.get('paginationSize'))

  const [currentPage, setCurrentPage] = useState(() => isNaN (currentTabIndexQueryParam)?  0 : currentTabIndexQueryParam)

  const [currentSubPage, setCurrentSubPage] = useState(() => isNaN(currentSubPageQueryParam) ? 0 : currentSubPageQueryParam);

  const [currentVideos, setCurrentVideos] = useState<PageAndVideos['videoSources']>([]);
  
  const [paginationSize, setPaginationSize] = useState(paginationSizeInitial);

  const webSocketContext = useContext(WebSocketContext);

  useEffect(()=>{
    router.push(`/?currentTabIndex=${currentPage}&currentSubPage=${currentSubPage}`)
    setCurrentVideos(webSocketContext.videoData[currentPage].videoSources.slice(currentSubPage * paginationSize, (currentSubPage + 1) * paginationSize ))
  },[
    currentPage,
    currentSubPage,
    paginationSize,
    // pages,
    // router
  ])

  useEffect(()=>{
    webSocketContext.setVideoData(webSocketContext.videoData)
  },[])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '2rem'
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: '1rem',
          border: 'solid white 1px',
          padding: '1rem',
          backgroundColor: '#009000',
          borderRadius: '0 0 3rem 3rem'
        }}>
        <label>Game: </label>
        <select
          value={currentPage}
          onChange={ e => setCurrentPage(Number(e.target.value)) }>
          
          { webSocketContext.videoData.map((page, index) => (

              <option 
                key={page.pageName} 
                value={index}>
                  {page.pageName}
              </option>
            ))
          }
        </select>

        <label>Page: </label>
        <select
          onChange={(e)=>{
            setCurrentSubPage(Number(e.target.value) - 1)
          }}
          value={currentSubPage}>

          <PaginationSizingOptions 
            min={1}
            max={Math.ceil(webSocketContext.videoData[currentPage].videoSources.length / paginationSize)}/>
        </select>

        <label> Number per page: </label>
        <select
          onChange={(e)=>{
            setPaginationSize(Number(e.target.value))
          }}
          value={paginationSize}>
          <PaginationSizingOptions 
            min={3}
            max={12}/>
        </select>

        <ReconnectButton></ReconnectButton>
        
        <button
          disabled={webSocketContext.webSocketRes.socketState === 'Closed'}
          onClick={()=>{

            const lobbyId = prompt('Lobby Id: ')

            if (!lobbyId) {

              alert('No lobby id provided')
              
              return;
            }

            router.push(`/lobbyId?lobbyId=${lobbyId}`)
          }}>
          Request Join Lobby
        </button>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
        flex: 1
      }}>

        <div
          className="videoContainer">
          {
            currentVideos.map((video, index) => (

              <video 
                className="videoFromPicker"
                key={video.track} 
                // controls 
                onClick={()=>{ router.push(`/${currentPage}/${currentSubPage * paginationSize + index}`) }}
                width={"100%"} 
                preload={"metadata"}>
                <source src={video.track}></source>
              </video>
            ))
          }
        </div>
      </div>
    </div>
  );
}