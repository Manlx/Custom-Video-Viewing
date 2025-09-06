"use client"
import { useState } from "react";

type VideoPaginatorProps = {
  pages: {
    pageName: string,
    videos: string[]
  }[]
}

export const VideoPaginator: React.FC<VideoPaginatorProps> = ({
  pages
}) => {

  const [currentTab, setCurrentTab] = useState(pages[0])

  return (
    <div
      style={{
        height: '100%'
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          border: 'solid white 1px',
          margin: '0 3rem 3rem 3rem',
          borderRadius: '0 0 20rem 20rem'
        }}>
        {
          pages.map(page => (
            
            <h1 
              key={page.pageName} 
              className="NavHeaderItem"
              onClick={()=> setCurrentTab(page)}>{page.pageName}</h1>
          ))
        }
      </div>
      <div
        className="videoContainer">
        {
          currentTab.videos.map(video => (

            <video 
              key={video} 
              controls 
              width={"100%"} 
              preload={"metadata"}>
              <source src={video}></source>
            </video>
          ))
        }
      </div>
    </div>
  );
}