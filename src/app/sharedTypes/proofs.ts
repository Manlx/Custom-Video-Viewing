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
    messageType: 'string',
  }),
  LobbyCreated: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['LobbyCreated']>({
    messageType: 'string',
    lobbyId: 'string'
  }),
  JoinLobby: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['JoinLobby']>({
    lobbyId: 'string',
    messageType: 'string'
  }),
  LobbyJoinOutcome: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['LobbyJoinOutcome']>({
    outcome: 'string',
    messageType: 'string'
  }),
  LobbySyncResponse: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['LobbySyncResponse']>({
    messageType: 'string',
    hostCurrentState: {
      currentVideoTime: 'number',
      isPlaying: 'boolean',
      playBackSpeed: 'number'
    }
  }),
  RequestSync: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['RequestSync']>({
    messageType: 'string'
  }),
  HostLobbySyncResponse: GenerateObjectTypeProof<NetworkTypes.WebSocketMessagesObject['HostLobbySyncResponse']>({
    hostCurrentState: {
      currentVideoTime: 'number',
      isPlaying: 'boolean',
      playBackSpeed: 'number'
    },
    messageType: 'string'
  }),
  WebSocketMessages: WebSocketMessageProof
}