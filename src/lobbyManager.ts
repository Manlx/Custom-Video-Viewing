import { WebSocket } from 'ws';
import crypto from "crypto";
import { NetworkTypesProofs } from './app/sharedTypes/proofs.ts';

export class LobbyManager{

  static ConnectionHandler = () => {

  }

  static Lobbies: {[key: string]: Lobby} = {}

  static OnMessage: ((this: WebSocket, data: WebSocket.RawData, isBinary: boolean) => void) = function(data: WebSocket.RawData, isBinary: boolean){

    try {
      const dataObj = JSON.parse(data.toString())

      if (!NetworkTypesProofs.CreateLobby(dataObj)) {

        return;
      }

      const lobbyId = crypto.randomUUID();

      LobbyManager.Lobbies[lobbyId] = new Lobby();

      LobbyManager.Lobbies[lobbyId].connectNew(this)

      this.send(JSON.stringify({
        message: 'YourLobbyHasBeenCreated',
        lobbyId
      } satisfies NetworkTypes.LobbyCreated))

    } catch (error) {
     
      console.log('LobbyManager failed parse json',error)
    }
  }

  static AddNewConnection(newConnection: WebSocket){

    newConnection.off('message', LobbyManager.OnMessage)
    newConnection.on('message', LobbyManager.OnMessage)
  }
}

export class Lobby{

  connections: WebSocket[] = [];

  messageHandler: ((event: WebSocket.MessageEvent) => void) = function(messageEvent: WebSocket.MessageEvent) {

    try {

      const messageObject = JSON.parse(messageEvent.data.toString())
      
      if (NetworkTypesProofs.PauseVideoRequest(messageObject)){
  
        return;
      }
  
      if (NetworkTypesProofs.PlayVideoRequest(messageObject)){
  
        return;
      }
    } catch (error) {
      
    }

  }

  static ConnectionRemoverGenerator(lobby: Lobby): (this: WebSocket, code: number, reason: Buffer) => void {

    return function(code, reason){

      const removeIndex = lobby.connections.findIndex((connection) => connection === this)

      lobby.connections = lobby.connections.slice(0, removeIndex).concat(lobby.connections.slice(removeIndex + 1))

      this.removeEventListener('message', lobby.messageHandler)
    }
  }

  connectionDrop: (this: WebSocket, code: number, reason: Buffer) => void = Lobby.ConnectionRemoverGenerator(this)

  connectNew(newConnection: WebSocket) {

    this.connections.push(newConnection)

    newConnection.addEventListener('message', this.messageHandler)

    newConnection.on('close', this.connectionDrop)
  }

  currentLobbyState: {
    isPlaying: boolean
  } = {
    isPlaying: false
  }
}