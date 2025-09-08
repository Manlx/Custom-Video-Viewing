"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';

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

  // const [currentTab, setCurrentTab] = useState(pages[0])

  const router = useRouter()

  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  const [currentSubPage, setCurrentSubPage] = useState(0);

  const [paginationSize, setPaginationSize] = useState(paginationSizeInitial);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
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
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%'
      }}>

        <div
          className="videoContainer">
          {
            pages[currentTabIndex].videos.slice(currentSubPage * paginationSize, (currentSubPage + 1) * paginationSize ).map(video => (

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