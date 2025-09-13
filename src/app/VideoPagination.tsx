"use client"
import { useContext, useEffect, useState } from "react";
import { useRouter,useSearchParams  } from 'next/navigation';
import { WebSocketContext } from "./Providers";
import { ReconnectButton } from "./ReconnectButton";

type VideoPaginatorProps = {
  pages: {
    pageName: string,
    videos: string[]
  }[],
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
  pages,
  paginationSize: paginationSizeInitial = 6
}) => {

  const searchParams = useSearchParams();
  
  const router = useRouter()

  const 
    currentTabIndexQueryParam = Number(searchParams.get('currentTabIndex')), 
    currentSubPageQueryParam = Number(searchParams.get('currentSubPage'))
    // paginationSizeQueryParam = Number(searchParams.get('paginationSize'))

  const [currentTabIndex, setCurrentTabIndex] = useState(() => isNaN (currentTabIndexQueryParam)?  0 : currentTabIndexQueryParam)

  const [currentSubPage, setCurrentSubPage] = useState(() => isNaN(currentSubPageQueryParam) ? 0 : currentSubPageQueryParam);
  

  const [currentVideos, setCurrentVideos] = useState<string[]>([]);
  
  const [paginationSize, setPaginationSize] = useState(paginationSizeInitial);

  const webSocketContext = useContext(WebSocketContext);

  useEffect(()=>{
    router.push(`/?currentTabIndex=${currentTabIndex}&currentSubPage=${currentSubPage}`)
    setCurrentVideos(pages[currentTabIndex].videos.slice(currentSubPage * paginationSize, (currentSubPage + 1) * paginationSize ))
  },[
    currentTabIndex,
    currentSubPage,
    paginationSize,
    // pages,
    // router
  ])

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
          value={currentTabIndex}
          onChange={ e => setCurrentTabIndex(Number(e.target.value)) }>
          
          { pages.map((page, index) => (

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
            max={Math.ceil(pages[currentTabIndex].videos.length / paginationSize)}/>
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
            currentVideos.map(video => (

              <video 
                className="videoFromPicker"
                key={video} 
                // controls 
                onClick={()=>{ router.push(encodeURIComponent(`${video}.watchTogether`)) }}
                width={"100%"} 
                preload={"metadata"}>
                <source src={video}></source>
              </video>
            ))
          }
        </div>
      </div>
    </div>
  );
}