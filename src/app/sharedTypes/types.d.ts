declare namespace NetworkTypes {

  type PauseVideoRequest = {
    type: 'PauseVideoRequest'
  }

  type PlayVideoRequest = {
    type: 'PlayVideoRequest'
  }

  type CreateLobby = {
    type: 'CreateLobby'
  }

  type JoinLobby = {
    type: 'JoinLobby'
    lobbyId: string
  }

  type LobbyJoinOutcome = {
    type: 'LobbyJoinOutcome'
    outcome: 'Accepted'|'Rejected: Lobby Not Found' | 'Rejected: Lobby is full'
  }

  type LobbySync = {
    type: 'LobbySync'
    lobbyId: 'Accepted'|'Rejected: Lobby Not Found' | 'Rejected: Lobby is full'
  }

  type LobbyCreated = {
    type: 'LobbyCreated'
    lobbyId: string
  }

  type GetLobbyState = {
    type: 'GetLobbyState'
  }

  type LobbyState = {
    type: 'LobbyState'
    lobbyState: {
      isPlaying: boolean
    }
  }

  type ResumeInstructionFromServer = {
    type: 'ResumeInstructionFromServer'
  }

  type WebSocketMessages = PauseVideoRequest | PlayVideoRequest | CreateLobby | JoinLobby | LobbyCreated | GetLobbyState | LobbyState | ResumeInstructionFromServer

  type MessageEvent<T extends WebSocketMessages> = T & {
    eventFunction: (context: Omit<MessageEvent<T>, 'eventFunction'>, self: import('ws').WebSocket) => void
    eventName: `${T['type']}`
  }

  type PauseVideoRequestEvent =  MessageEvent<PauseVideoRequest>
  type PlayVideoRequestEvent =  MessageEvent<PlayVideoRequest>
  type CreateLobbyEvent =  MessageEvent<CreateLobby>
  type JoinLobbyEvent =  MessageEvent<JoinLobby>
  type LobbyJoinOutcomeEvent =  MessageEvent<LobbyJoinOutcome>
  type LobbySyncEvent =  MessageEvent<LobbySync>
  type LobbyCreatedEvent =  MessageEvent<LobbyCreated>
  type GetLobbyStateEvent =  MessageEvent<GetLobbyState>
  type LobbyStateEvent =  MessageEvent<LobbyState>
  type ResumeInstructionFromServerEvent =  MessageEvent<ResumeInstructionFromServer>

  type WebSocketMessageEvents = PauseVideoRequestEvent | PlayVideoRequestEvent | CreateLobbyEvent | JoinLobbyEvent | LobbyJoinOutcomeEvent | LobbySyncEvent | LobbyCreatedEvent | GetLobbyStateEvent | LobbyStateEvent | ResumeInstructionFromServerEvent

  type NetworkTypesProof = {
    [key in WebSocketMessages as `${key['type']}`]: (data: unknown) => data is key
  } & {
    'WebSocketMessages':(data: unknown) => data is WebSocketMessages
  }

  type NetworkClientProfile = {
    webSocket: WebSocket
    lobby: NetworkClientProfile[],
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
