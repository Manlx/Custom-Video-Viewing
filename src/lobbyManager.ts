import { WebSocket } from 'ws';
import crypto from "crypto";
import { NetworkTypesProofs } from './app/sharedTypes/proofs.ts';

export class LobbyManager{

  static ConnectionHandler = () => {

  }

  static Lobbies: {[key: string]: Lobby} = {}

  static OnMessage: ((this: WebSocket, data: WebSocket.RawData, isBinary: boolean) => void) = function(data: WebSocket.RawData){

    const dataString = data.toString();

    if (!dataString) {

      return;
    }

    try {

      const dataObj = JSON.parse(dataString)

      if (NetworkTypesProofs.CreateLobby(dataObj)) {

        const lobbyId = crypto.randomUUID();
  
        LobbyManager.Lobbies[lobbyId] = new Lobby();
  
        LobbyManager.Lobbies[lobbyId].connectNew(this, true)
  
        this.send(JSON.stringify({
          type: 'LobbyCreated',
          lobbyId
        } satisfies NetworkTypes.LobbyCreated))

        return;
      }

      if (NetworkTypesProofs.JoinLobby(dataObj)) {

        const lobby = LobbyManager.Lobbies[dataObj.lobbyId];

        if (!lobby) {

          this.send(JSON.stringify({
            outcome: 'Rejected: Lobby Not Found',
            type: 'LobbyJoinOutcome'
          } satisfies NetworkTypes.LobbyJoinOutcome))
        }
      }


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

  static ConnectionRemoverGenerator(lobby: Lobby): (this: WebSocket, code: number, reason: Buffer) => void {

    return function(){

      const removeIndex = lobby.connections.findIndex((connection) => connection === this)

      lobby.connections = lobby.connections.slice(0, removeIndex).concat(lobby.connections.slice(removeIndex + 1))

      this.removeEventListener('message', lobby.messageHandler)
    }
  }

  connections: WebSocket[] = [];

  lobbyLeader: WebSocket | undefined = undefined;

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
      
      console.error(error)
    }

  }

  connectionDrop: (this: WebSocket, code: number, reason: Buffer) => void = Lobby.ConnectionRemoverGenerator(this)

  connectNew(newConnection: WebSocket, isLobbyLeader: boolean) {

    this.connections.push(newConnection)

    if (isLobbyLeader) {

      this.lobbyLeader = newConnection;
    }

    newConnection.addEventListener('message', this.messageHandler)

    newConnection.on('close', this.connectionDrop)
  }
}