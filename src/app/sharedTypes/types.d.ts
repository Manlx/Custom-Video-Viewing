declare namespace NetworkTypes {

  type HostCurrentState = {
    playBackSpeed: number
    currentVideoTime: number
    currentSrc: string
    paused: boolean
    textTrackList: string[]
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

  type MessageEventFunction<T extends WebSocketMessages> = (this: CommonWebSocket, context: Omit<MessageEvent<T>, 'eventFunction'>, ) => void

  type MessageEvent<T extends WebSocketMessages> = T & {
    eventFunction: MessageEventFunction<T> | MessageEventFunction<T>[]
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

type TypeOfReturn = "undefined" | "object" | "function" | "boolean" | "number" | "bigint" | "string" | "symbol" | "unknown"

type GenIsTypeLiteral<GenType,T> = T extends GenType ? ( GenType extends T ? false : true) : false

type IsStringLiteral<T> = GenIsTypeLiteral<string,T>;

type IsNumberLiteral<T> = GenIsTypeLiteral<number,T>;

type IsTrueType<T> = T extends true ? true : false

type IsFalseType<T> = T extends false ? true : false

type IsBooleanLiteral<T> = IsTrueType<T> extends true
? true
: IsFalseType<T> extends true
? true
: false

type IsArray<T> = T extends any[]
? T extends [infer a, ...infer rest]
  ? false
  : true
: false

type IsNonUnknownArray<T> = T extends []
? false
: T extends any []
? T extends [infer a, ...infer rest]
  ? false
  : true
: false

type TupleToTypeOfStringTypeOf<T> = T extends [infer firstType, ...infer rest]
? IsNonEmptyTuple<stringTypeOf<rest>> extends true
  ? [stringTypeOf<firstType>, ...stringTypeOf<rest>]
  : [stringTypeOf<firstType>]
: never

type StringTostringTypeOf<T extends string> = IsStringLiteral<T> extends true
? [Extract<TypeOfReturn, 'string'>, T]
: Extract<TypeOfReturn, 'string'>

type NumberTostringTypeOf<T extends number> = IsNumberLiteral<T> extends true
? [Extract<TypeOfReturn, 'number'>, T]
: Extract<TypeOfReturn, 'number'>

type IsTuple<T> = T extends readonly [infer Head, ...infer Tail]
  ? number extends T['length']
    ? false // It's a regular array if length is 'number' (variable length)
    : true // It's a tuple if length is a literal type (fixed length)
  : false; // Not an array or tuple

type IsEmptyTuple<T> = T extends any[]
? T['length'] extends 0 
  ? true 
  : false
: false

type IsNonEmptyTuple<T> = IsTuple<T> extends true
? IsEmptyTuple<T> extends true
  ? false
  : true
: false

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

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type RecursiveObject = {
  [key in string]: RecursiveObject | bigint | number | string | boolean | undefined | null | symbol | RecursiveObject[] | number[] | string[] | boolean[] | bigint[]
}

type UnionTostringTypeOf<T> = TupleToTypeOfStringTypeOf<UnionToTuple<T>>

type ArrayToStringTypeOf<T> = T extends any[] 
? ['isAnXArray',stringTypeOf<T[number]>]
: never;

type stringTypeOf<T> = 
    IsUnion<T> extends true
  ? UnionTostringTypeOf<T>
  : IsNonEmptyTuple<T> extends true
  ? TupleToTypeOfStringTypeOf<T>
  : T extends undefined
  ? Extract<TypeOfReturn, 'undefined'>
  : T extends string
  ? StringTostringTypeOf<T>
  : T extends number
  ? NumberTostringTypeOf<T>
  : T extends (...args: unknown[]) => unknown
  ? Extract<TypeOfReturn, 'function'>
  : T extends boolean
  ? Extract<TypeOfReturn, 'boolean'>
  : T extends bigint
  ? Extract<TypeOfReturn, 'bigint'>
  : T extends symbol
  ? Extract<TypeOfReturn, 'symbol'>
  : T extends RecursiveObject
  ? CreateType<T>
  : IsNonUnknownArray<T> extends true
  ? ArrayToStringTypeOf<T>
  : never

type CreateType<T extends RecursiveObject> = {
  [key in keyof T]-?: stringTypeOf<T[key]>
}

type GenerateVideoHandlerType = typeof import ('../VideoHandler.ts').GenerateVideoHandler;

type VideoControlsFunctionsType = ReturnType<GenerateVideoHandlerType>;

type VideoControlOptions = keyof VideoControlsFunctionsType;

type CommonWebSocket = import('ws').WebSocket | WebSocket

type PageAndVideos = {
  pageName: string,
  videoSources: {
    track: string,
    subtitles?: string
  }[]
}

type WebSocketContextType = {
  webSocketEvents: NetworkTypes.HandleWebSocketEventObject;
  setWebSocketEvents: React.Dispatch<React.SetStateAction<NetworkTypes.HandleWebSocketEventObject>>;
  webSocketRes: useWebSocketReturn;
  videoData: PageAndVideos[],
  setVideoData: Dispatch<SetStateAction<PageAndVideos[]>>
}