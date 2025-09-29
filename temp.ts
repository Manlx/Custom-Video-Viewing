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

type GenIsTypeLiteral<GenType,T> = T extends GenType ? ( GenType extends T ? false : true) : false

type IsStringLiteral<T> = GenIsTypeLiteral<string,T>;

type IsNumberLiteral<T> = GenIsTypeLiteral<number,T>;

type IsBigIntLiteral<T> =
  T extends bigint
    ? `${T}` extends `${infer N extends bigint}n`
      ? N extends T
        ? true
        : false
      : false
    : false;

type IsTrueType<T> = T extends true ? true : false

type IsFalseType<T> = T extends false ? true : false

type IsBooleanLiteral<T> = IsTrueType<T> extends true
? true
: IsFalseType<T> extends true
? true
: false

type IsNullLiteral<T> = T extends null ? true : false

type IsUndefinedLiteral<T> = T extends undefined ? true : false

type IsArray<T> = T extends (infer U)[] ? true : false;

type StringTostringTypeOf<T extends string> = IsStringLiteral<T> extends true
? ['string', T]
: 'string'

type NumberTostringTypeOf<T extends number> = IsNumberLiteral<T> extends true
? ['number', T]
: 'number'

type BooleanTostringTypeOf<T extends boolean> = IsBooleanLiteral<T> extends true
? T extends true
  ? ['boolean', true]
  : ['boolean', false]
: 'boolean'

type BigIntTostringTypeOf<T extends bigint> = IsBigIntLiteral<T> extends true
? ['bigInt', T]
: 'bigInt'

type NullTostringTypeOf<T extends null> = 'null'

type UndefinedTostringTypeOf<T extends undefined> = 'undefined'

type ArrayTostringTypeOf<T extends any[]> = IsSimpleType<T[number]> extends true 
? IsUnion<T[number]> extends true
  ? [`PrimUnionArray`, StringTypeOf<T[number]>]
  : [`PrimArray`, SimpleTypeStringTypeOf<T[number]>]
: ['ObjectArray', StringTypeOf<T[number]>]

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type IsEmptyArray<T> = T extends [] ? true: false ;

type IsTuple<T> = T extends [any, ...any] 
? true
: false;

type IsSpreadAble<T> = IsTuple<T> extends true
? IsEmptyArray<T> extends false
  ? true
  : false
: false

// Helper type to convert a union to an intersection
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type UnionToTuple_UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
  ? I
  : never;

type LastInUnion<U> = UnionToTuple_UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

type UnionToTuple<T, Last = LastInUnion<T>> = [T] extends [never]
  ? []
  : [Last, ...UnionToTuple<Exclude<T, Last>>];

type TupleTypeToStringTypeOf<T> =T extends [infer UnionFirst, ... infer UnionRest]
? IsSpreadAble<StringTypeOf<UnionRest>> extends true
  ? [ StringTypeOf<UnionFirst>, ...StringTypeOf<UnionRest>]
  : [StringTypeOf<UnionFirst>]
: never

type Arrayify<T> = T extends any ? T[] : never;

type IsSimpleType<T> = T extends string
? true
: T extends number
? true
: T extends boolean
? true
: T extends bigint
? true
: T extends null
? true
: T extends undefined
? true
: false

type SimpleTypeStringTypeOf<T> = 
T extends string
? StringTostringTypeOf<T>
: T extends number
? NumberTostringTypeOf<T>
: T extends boolean
? BooleanTostringTypeOf<T>
: T extends bigint
? BigIntTostringTypeOf<T>
: T extends null
? NullTostringTypeOf<T>
: T extends undefined
? UndefinedTostringTypeOf<T>
: ["unknown"]

type StringTypeOf<T> = 
IsEmptyArray<T> extends true
? T
: IsUnion<T> extends true
? TupleTypeToStringTypeOf<UnionToTuple<T>>
: IsSpreadAble<T> extends true
? TupleTypeToStringTypeOf<T>
: IsSimpleType<T> extends true
? SimpleTypeStringTypeOf<T>
: T extends any[]
? ArrayTostringTypeOf<T>
: T extends Record<string | number, unknown>
? CreateType<T>
: never

type CreateType<T> = T extends object 
? IsArray<T> extends false 
  ? {
      [key in keyof T]-?: StringTypeOf<T[key]>
    }
  : StringTypeOf<T>
: StringTypeOf<T>

export function isObject(possibleObject: unknown):possibleObject is {}  {
  
  return typeof possibleObject === 'object' && !Array.isArray(possibleObject)
}

export function isRecord(possibleRecord: unknown): possibleRecord is Record<number | string, unknown> {

  if (typeof possibleRecord !== 'object') {

    return false;
  }

  if (Array.isArray(possibleRecord)) {

    return false;
  }

  if (possibleRecord === null) {

    return false;
  }

  if (Object.keys(possibleRecord).length > 0) {

    return true;
  }

  return false;
}

// Reducing the scope, to not include complex mixed like union arrays or primitives like symbols or function

type CateredBasicTypes = null | undefined | boolean | (number & {}) | 0 | (string & {}) | '' | (bigint & {}) | 0n

type CateredArrayTypes = Arrayify<CateredBasicTypes> | CateredBasicTypes[]

type CateredObjectType = {
  [key: string] : CateredBasicTypes | CateredArrayTypes | CateredObjectType | CateredObjectType[]
}

type AllCateredTypes = CateredBasicTypes | CateredArrayTypes | CateredObjectType | CateredObjectType[]

export const GenerateObjectTypeProof = function<ProvenType extends AllCateredTypes>(exampleObject: CreateType<ProvenType>): ((data: unknown) => data is ProvenType) {
  
  if (typeof exampleObject === 'undefined') {

    return ((data) => {
      return data === undefined;
    }) as (data: unknown) => data is ProvenType;
  }

  if (typeof exampleObject === 'symbol') {

    // ToDo Add type checking for symbol
    return ((data) => {
      return false;
    }) as (data: unknown) => data is ProvenType;
  }

  if (typeof exampleObject === 'function') {

    // ToDo Add type checking for function
    // Not
    return ((data) => { return typeof data === "function" && exampleObject === "function"}) as (data: unknown) => data is ProvenType;
  }

  if (Array.isArray(exampleObject)) {

    return ((data) => {

      const [
        arraySpecies,
        allowedValues 
      ] = exampleObject

      switch (arraySpecies) {
        case 'string': return data === allowedValues
        case 'boolean': return data === allowedValues
        case 'number': return data === allowedValues
        case 'PrimArray': {

          if (!Array.isArray(data)){

            return false
          }
          if (data.length === 0) {

            return true;
          }

          if (Array.isArray(allowedValues)){

            const [
              typeOfValue,
              literal
            ] = allowedValues;

            if (typeof data[0] === typeOfValue && data[0] === literal){

              return true
            }
            return false;
          }
          if (allowedValues === 'null'){

            return data[0] === null
          }

          return typeof data[0] === allowedValues
        }
        case 'PrimUnionArray': return Array.isArray(data) && (data.length > 0 ? allowedValues : true)
      }
      
    }) as (data: unknown) => data is ProvenType;
  }

  if (exampleObject === null) {

    return ((data) => data === null) as (data: unknown) => data is ProvenType;
  }

  if (typeof exampleObject === 'string') {

    if (!nonLiteralPrimitives.includes(exampleObject)) {

      return ((data) => {

        console.log("Something with the type checker has gone horribly wrong: #1")

        return false;
      }) as (data: unknown) => data is ProvenType;
    }

    switch (exampleObject) {
      case 'string': return ((data) => typeof data === 'string') as (data: unknown) => data is ProvenType;
      case 'number': return ((data) => typeof data === 'number') as (data: unknown) => data is ProvenType;
      case 'boolean': return ((data) => typeof data === 'boolean') as (data: unknown) => data is ProvenType;
      case 'bigint': return ((data) => typeof data === 'bigint') as (data: unknown) => data is ProvenType;
      case 'undefined': return ((data) => typeof data === 'undefined') as (data: unknown) => data is ProvenType;
      case 'null': return ((data) => data === null) as (data: unknown) => data is ProvenType;

      default: return ((data) => {
        console.log("Something with the type checker has gone horribly wrong: #2")
        return false
      }) as (data: unknown) => data is ProvenType;
    }
  }

  const keys = Object.keys(exampleObject)
  
  return ((data) => {

    if (typeof data === 'string') {

      try {
        data = JSON.parse(data)
      } catch {
        
        return false;
      }
    }

    if (!isRecord(data) || !isRecord(exampleObject)) {

      return false;
    }

    // we are `as ProvenType` a lot but that is because we are assuming an optimistic take on the proof
    // This is equivalent to the mapped type called CreateType, as we will be looping through the keys of the type
    for (let i = 0; i < keys.length; i++) {

      const currentKey = keys[i]

      const evaluatedProperty = data[currentKey]

      const typeValue = exampleObject[currentKey]

      if ( typeof typeValue === 'string' && typeOfTypes.includes(typeValue)){

        if (typeof evaluatedProperty !== typeValue) {

          return false;
        }
        continue;
      }

      if (Array.isArray(typeValue)){
        typeValue
      }
    }

    return true;
  }) as (data: unknown) => data is ProvenType;

}

const WebSocketMessageProof = ((data) => {

  const NetworkTypesProofsKeys = (Object.keys(NetworkTypesProofs) as (keyof NetworkTypes.NetworkTypesProof)[]).filter(key => key !== 'WebSocketMessages') 

  return NetworkTypesProofsKeys.some(key => NetworkTypesProofs[key](data))
}) as ((data: unknown) => data is NetworkTypes.WebSocketMessages)

export const NetworkTypesProofs: NetworkTypes.NetworkTypesProof = {
  CreateLobby: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['CreateLobby']>({
    messageType: ['string', 'CreateLobby'],
  }),
  LobbyCreated: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['LobbyCreated']>({
    messageType: ['string','LobbyCreated'],
    lobbyId: 'string'
  }),
  JoinLobby: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['JoinLobby']>({
    lobbyId: 'string',
    messageType: ['string', 'JoinLobby']
  }),
  LobbyJoinOutcome: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['LobbyJoinOutcome']>({
    messageType: ['string', 'LobbyJoinOutcome'],
    outcome: [
      ['string','Rejected: Lobby is full'],
      ['string','Rejected: Lobby Not Found'],
      ['string','Accepted: Joined as guest'],
      ['string','Accepted: Joined As Host']
    ]
  }),
  LobbySyncResponse: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['LobbySyncResponse']>({
    messageType: ['string','LobbySyncResponse'],
    hostCurrentState: {
      currentSrc: 'string',
      currentVideoTime: 'number',
      paused: [['boolean',true], ['boolean', false]],
      playBackSpeed: 'number',
      textTrackList: ['PrimArray', 'string']
    }
  }),
  RequestSync: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['RequestSync']>({
    messageType: ['string', 'RequestSync']
  }),
  HostLobbySyncResponse: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['HostLobbySyncResponse']>({
    hostCurrentState: {
      currentVideoTime: 'number',
      paused: [['boolean',true], ['boolean', false]],
      currentSrc: 'string',
      playBackSpeed: 'number',
      textTrackList: ['PrimArray', 'string']
    },
    messageType: ['string','HostLobbySyncResponse']
  }),
  WebSocketMessages: WebSocketMessageProof
}

type temp = CreateType<{
  data: [1234,'lol',true,"say my name"]
  lol: "words"[]
}>

const test: temp = {
  data: [
    [
      'number',
      1234
    ],
    [
      'string',
      'lol'
    ],
    [
      'boolean',
      true
    ],
    [
      'string',
      'say my name'
    ]
  ],
  lol: [
    'PrimArray',
    ['string','words']
  ]
}