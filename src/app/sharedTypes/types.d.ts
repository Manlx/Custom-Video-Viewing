declare namespace NetworkTypes {

  type HostCurrentState = {
    playBackSpeed: number
    currentVideoTime: number
    currentSrc: string
    paused: boolean
  }
  
  type WebSocketMessagesObject = {

    CreateLobby: {
      messageType: 'CreateLobby'
    }
  
    JoinLobby: {
      messageType: 'JoinLobby'
      lobbyId: string
    }
  
    LobbyJoinOutcome: {
      messageType: 'LobbyJoinOutcome'
      outcome: 'Accepted: Joined As Host' | 'Accepted: Joined as guest' |'Rejected: Lobby Not Found' | 'Rejected: Lobby is full'
    }
  
    LobbySyncResponse: {
      messageType: 'LobbySyncResponse'
      hostCurrentState: HostCurrentState
    }

    HostLobbySyncResponse: {
      messageType: 'HostLobbySyncResponse'
      hostCurrentState: HostCurrentState
    }
  
    RequestSync: {
      messageType: 'RequestSync'
    }
  
    LobbyCreated: {
      messageType: 'LobbyCreated'
      lobbyId: string
    }
  }

  type WebSocketMessages = WebSocketMessagesObject[keyof WebSocketMessagesObject]

  type MessageEventFunction = (this: CommonWebSocket, context: Omit<MessageEvent<T>, 'eventFunction'>, ) => void

  type MessageEvent<T extends WebSocketMessages> = T & {
    eventFunction: MessageEventFunction | MessageEventFunction[]
    eventName: `${T['messageType']}`
  }

  type WebSocketMessageEventsObject = {[key in WebSocketMessages as `${key['messageType']}Event` ]: MessageEvent<key> }

  type WebSocketMessageEvents = WebSocketMessageEventsObject[keyof WebSocketMessageEventsObject]

  type NetworkTypesProof = {
    [key in WebSocketMessages as `${key['messageType']}`]: (data: unknown) => data is key
  } & {
    'WebSocketMessages':(data: unknown) => data is WebSocketMessages
  }

  type NetworkClientProfile = {
    webSocket: CommonWebSocket
    lobby: NetworkClientProfile[],
  }

  type HandleWebSocketEventObject = {
    [key in NetworkTypes.WebSocketMessageEvents as key['eventName']]?: key['eventFunction']  
  }
}

type typeOfReturn = "undefined" | "object" | "function" | "boolean" | "number" | "bigint" | "string" | "symbol" | "unknown"

type stringTypeOf<T> =  T extends string
 ? Extract<typeOfReturn, 'string'>
 : T extends undefined
 ? Extract<typeOfReturn, 'undefined'>
 : T extends (...args: unknown[]) => unknown
 ? Extract<typeOfReturn, 'function'>
 : T extends number
 ? Extract<typeOfReturn, 'number'>
 : T extends boolean
 ? Extract<typeOfReturn, 'boolean'>
 : T extends bigint
 ? Extract<typeOfReturn, 'bigint'>
 : T extends symbol
 ? Extract<typeOfReturn, 'symbol'>
 : T extends RecursiveObject
 ? CreateType<T>
 : "unknown"

type CreateType<T extends RecursiveObject> = {
  [key in keyof T]: stringTypeOf<T[key]>
}

type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

// Helper to extract one element from the union (its order is not guaranteed)
type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => void : never
> extends (x: infer L) => void
  ? L
  : never;

// Helper to convert a union of functions to an intersection of functions
type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type RecursiveObject = {[key in string | number]: RecursiveObject | number | string | boolean | undefined | null | symbol }

type GenerateVideoHandlerType = typeof import ('../VideoHandler.ts').GenerateVideoHandler;

type VideoControlsFunctionsType = ReturnType<GenerateVideoHandlerType>;

type VideoControlOptions = keyof VideoControlsFunctionsType;

type CommonWebSocket = import('ws').WebSocket | WebSocket