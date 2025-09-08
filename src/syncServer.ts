import { WebSocketServer } from 'ws';
import { NetworkTypesProofs } from './app/sharedTypes/proofs.ts';

const PORT = 8080;

const wss = new WebSocketServer({
  port: PORT,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
}, () => {

  console.log(`listening on: ws://localhost:${PORT}`)
});

const Lobbies: {
  [key: number]: NetworkTypes.NetworkClientProfile[]
} = {}

wss.addListener('connection', (wsClient, req) => {

  wsClient.on('message',(data,isBinary)=>{

    try {
      const dataObj = JSON.parse(data.toString());

      if (NetworkTypesProofs.CreateLobby(dataObj)){

        console.log('Creating Lobby: ', dataObj.lobbyId)
      }

    } catch (error) {
      
      return;
    }
  })

  wsClient.on('open', ()=>{

    console.log('Opened socket client')

    wsClient.send(JSON.stringify({
      message: "Hello from server"
    }))
  })
})