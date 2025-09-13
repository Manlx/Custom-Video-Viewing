import { WebSocket } from 'ws';
import crypto from "crypto";

import { NetworkHandler } from './NetworkHandler.ts';

export class LobbyManager{

  static Lobbies: {[key: string]: Lobby} = {}

  static AddNewConnection(newConnection: WebSocket){

    NetworkHandler.handleWebSocket(newConnection,{

      CreateLobby(){
        const lobbyId = crypto.randomUUID();
  
        LobbyManager.Lobbies[lobbyId] = new Lobby();
  
        LobbyManager.Lobbies[lobbyId].connectNew(this, true)
  
        this.send(JSON.stringify({
          messageType: 'LobbyCreated',
          lobbyId
        } satisfies NetworkTypes.WebSocketMessagesObject['LobbyCreated']))

        return;
      },

      JoinLobby(this, context){
        const lobby = LobbyManager.Lobbies[context.lobbyId];

        if (!lobby) {

          this.send(JSON.stringify({
            outcome: 'Rejected: Lobby Not Found',
            messageType: 'LobbyJoinOutcome'
          } satisfies NetworkTypes.WebSocketMessagesObject['LobbyJoinOutcome']))
        }

        lobby.connectNew(this, false)
      }
    })

  }
}

export class Lobby{

  static ConnectionRemoverGenerator(lobby: Lobby): (this: CommonWebSocket, code: number, reason: Buffer) => void {

    return function(){

      const removeIndex = lobby.connections.findIndex((connection) => connection === this)

      lobby.connections = lobby.connections.slice(0, removeIndex).concat(lobby.connections.slice(removeIndex + 1))
    }
  }

  connections: CommonWebSocket[] = [];

  lobbyLeader: CommonWebSocket | undefined = undefined;

  connectionDrop: (this: CommonWebSocket, code: number, reason: Buffer) => void = Lobby.ConnectionRemoverGenerator(this)

  connectNew(newConnection: CommonWebSocket, isLobbyLeader: boolean) {

    this.connections.push(newConnection)

    const lobby = this;

    if (isLobbyLeader) {

      this.lobbyLeader = newConnection;

      NetworkHandler.handleWebSocket(newConnection, {

        HostLobbySyncResponse(context) {

          lobby.connections.forEach(clientCon => {
            clientCon.send(JSON.stringify({
              hostCurrentState: context.hostCurrentState,
              messageType: 'LobbySyncResponse'
            } satisfies NetworkTypes.WebSocketMessagesObject['LobbySyncResponse']))
          })
        }        
      })

      return
    }

    NetworkHandler.handleWebSocket(newConnection, {
      RequestSync(){
        lobby.lobbyLeader?.send(JSON.stringify({
          messageType:'RequestSync'
        } satisfies NetworkTypes.WebSocketMessagesObject['RequestSync']))
      }
    })

    lobby.lobbyLeader?.send(JSON.stringify({
      messageType:'RequestSync'
    } satisfies NetworkTypes.WebSocketMessagesObject['RequestSync']))

  }
}