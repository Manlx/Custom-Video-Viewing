declare namespace NetworkTypes {

  type PauseVideoRequest = {
    message: 'PauseVideoPlease'
  }

  type PlayVideoRequest = {
    message: 'PlayVideoPlease'
  }

  type CreateLobby = {
    message: 'CreateVideoWatchTogetherLobby',
  }

  type LobbyCreated = {
    message: 'YourLobbyHasBeenCreated',
    lobbyId: string
  }

  type GetLobbyState = {
    message: 'MayIHaveTheCurrentLobbyState',
  }

  type LobbyState = {
    message: 'YesYouMayHaveTheLobbyStateHereItIs',
    lobbyState: {
      isPlaying: boolean
    }
  }

  type ResumeInstructionFromServer = {
    message: 'YouMustResumeTheVideoNow',
  }

  type WebSocketMessages = CreateLobby | PlayVideoRequest | PauseVideoRequest | LobbyCreated | ResumeInstructionFromServer | LobbyState

  type NetworkTypesProof = {
    PlayVideoRequest: (data: unknown) => data is PlayVideoRequest
    PauseVideoRequest: (data: unknown) => data is PauseVideoRequest
    CreateLobby: (data: unknown) => data is CreateLobby
    ResumeInstructionFromServer: (data: unknown) => data is ResumeInstructionFromServer,
    LobbyCreated: (data: unknown) => data is LobbyCreated,
    LobbyState: (data: unknown) => data is LobbyState,
    
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
 : T extends Function
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
  U extends any ? (x: U) => void : never
> extends (x: infer L) => void
  ? L
  : never;

// Helper to convert a union of functions to an intersection of functions
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type RecursiveObject = {[key in string | number]: RecursiveObject | number | string | boolean | undefined | null | symbol }