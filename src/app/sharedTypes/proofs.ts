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
      } catch (error) {
        
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

export const NetworkTypesProofs: NetworkTypes.NetworkTypesProof = {
  PauseVideoRequest: GenerateObjectTypeProof<NetworkTypes.PauseVideoRequest>({
    message: 'string'
  }),
  PlayVideoRequest: GenerateObjectTypeProof<NetworkTypes.PlayVideoRequest>({
    message: 'string'
  }),
  CreateLobby: GenerateObjectTypeProof<NetworkTypes.CreateLobby>({
    message: 'string'
  }),
  ResumeInstructionFromServer: GenerateObjectTypeProof<NetworkTypes.ResumeInstructionFromServer>({
    message: 'string'
  }),
  LobbyCreated: GenerateObjectTypeProof<NetworkTypes.LobbyCreated>({
    message: 'string',
    lobbyId: 'string'
  }),
  LobbyState: GenerateObjectTypeProof<NetworkTypes.LobbyState>({
    message: 'string',
    lobbyState: {
      isPlaying: 'boolean'
    }
  }),
}