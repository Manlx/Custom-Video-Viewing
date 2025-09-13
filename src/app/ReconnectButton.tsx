import { useContext } from "react";
import { WebSocketContext } from "./Providers";

export const ReconnectButton: React.FC = () => {

  const webSocketContext = useContext(WebSocketContext);

  if (webSocketContext.webSocketRes.socketState === 'Open') {

    return null;
  }

  return (
    <button
      onClick={()=>{
        webSocketContext.webSocketRes.resetSocket()
      }}>
      Reconnect
    </button>
  )
}