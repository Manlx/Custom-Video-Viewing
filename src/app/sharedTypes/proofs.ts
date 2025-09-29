export function isObject(possibleObject: unknown):possibleObject is object  {
  
  return typeof possibleObject === "object" && !Array.isArray(possibleObject)
}

export function isRecursiveObject(possibleObject: unknown):possibleObject is RecursiveObject  {
  
  return typeof possibleObject === "object" && !Array.isArray(possibleObject)
}

export const GenerateObjectTypeProof = <ProvenType extends RecursiveObject> (exampleObject: CreateType<ProvenType>): ((data: unknown) => data is ProvenType) => {

  const keys = Object.keys(exampleObject)
  
  return ((data) => {

    if (typeof data === 'string') {

      try {
        data = JSON.parse(data)
      } catch {
        
        return false;
      }
    }

    if (!isObject(data)) {

      return false;
    }

    // we are `as ProvenType` a lot but that is because we are assuming an optimistic take on the proof
    for (let i = 0; i < keys.length; i++) {

      const currentKey: number | string = keys[i];
      const keyValueType = exampleObject[currentKey];

      if (Array.isArray(keyValueType)){

        const [
          typeName,
          literalValue
        ] = keyValueType
        if (typeof typeName === 'undefined' || typeof literalValue === 'undefined') {

          return false;
        }

        if (
          !(currentKey in data) ||
          (
            typeof (data as ProvenType)[currentKey] !== typeName as typeOfReturn &&
            typeof (data as ProvenType)[currentKey] !== 'object'
          ) || 
          ( (data as ProvenType)[currentKey] !== literalValue )
        ){

          return false;
        }
      }

      if (
        !(currentKey in data) ||
        (
          typeof (data as ProvenType)[currentKey] !== keyValueType &&
          typeof (data as ProvenType)[currentKey] !== 'object'
        )
      ){

        return false;
      }

      if (isRecursiveObject(exampleObject[currentKey])) {

        const currentSubObject = (data as ProvenType)[currentKey]

        return GenerateObjectTypeProof(exampleObject[currentKey])(currentSubObject) 
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
    messageType: ["string", "LobbyJoinOutcome"],
    outcome: [
      ['string','Accepted: Joined As Host'],
      ['string','Accepted: Joined as guest'],
      ['string','Rejected: Lobby Not Found'],
      ['string','Rejected: Lobby is full']
    ]
  }),
  LobbySyncResponse: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['LobbySyncResponse']>({
    messageType: 'string',
    hostCurrentState: {
      currentVideoTime: 'number',
      paused: 'boolean',
      playBackSpeed: 'number',

      // currentSrc: 'string'
    }
  }),
  RequestSync: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['RequestSync']>({
    messageType: 'string'
  }),
  HostLobbySyncResponse: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['HostLobbySyncResponse']>({
    hostCurrentState: {
      currentVideoTime: 'number',
      paused: 'boolean',
      currentSrc: 'string',
      playBackSpeed: 'number',

    },
    messageType: 'string'
  }),
  WebSocketMessages: WebSocketMessageProof
}