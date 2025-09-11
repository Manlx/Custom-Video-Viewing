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
  PauseVideoRequest: GenerateObjectTypeProof<NetworkTypes.PauseVideoRequest>({
    type: 'string',
  }),
  PlayVideoRequest: GenerateObjectTypeProof<NetworkTypes.PlayVideoRequest>({
    type: 'string',
  }),
  CreateLobby: GenerateObjectTypeProof<NetworkTypes.CreateLobby>({
    type: 'string',
  }),
  ResumeInstructionFromServer: GenerateObjectTypeProof<NetworkTypes.ResumeInstructionFromServer>({
    type: 'string'
  }),
  LobbyCreated: GenerateObjectTypeProof<NetworkTypes.LobbyCreated>({
    type: 'string',
    lobbyId: 'string'
  }),
  LobbyState: GenerateObjectTypeProof<NetworkTypes.LobbyState>({
    type: 'string',
      lobbyState: {
        isPlaying: 'boolean'
    }
  }),
  JoinLobby: GenerateObjectTypeProof<NetworkTypes.JoinLobby>({
    lobbyId: 'string',
    type: 'string'
  }),
  GetLobbyState: GenerateObjectTypeProof<NetworkTypes.GetLobbyState>({
    type: 'string'
  }),
  WebSocketMessages: WebSocketMessageProof
}