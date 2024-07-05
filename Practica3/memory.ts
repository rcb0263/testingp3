interface Character {
    id: number;
    name: string;
    status?: string;
    species?: string;
    gender?: string;
    origin?: {
      name: string;
      url: string;
    };
    location?: {
      name: string;
      url: string;
    };
    created?: string;
  }
  
  interface Location {
    id: number;
    name: string;
    type?: string;
    dimension?: string;
    created?: string;
  }
  
  class Memory {
    private static characters: Character[] = [];
    private static locations: Location[] = [];
  
    public static getAllCharactersFromMemory(): Character[] {
      return this.characters;
    }
  
    public static saveCharactersToMemory(characters: Character[]): void {
      this.characters = characters;
    }
  
    public static getCharacterByIdFromMemory(id: number): Character | undefined {
      return this.characters.find((character) => character.id === id);
    }
  
    public static getAllLocationsFromMemory(): Location[] {
      return this.locations;
    }
  
    public static saveLocationsToMemory(locations: Location[]): void {
      this.locations = locations;
    }
  
    public static getLocationByIdFromMemory(id: number): Location | undefined {
      return this.locations.find((location) => location.id === id);
    }
  }
  
  export default Memory;

  export function saveCharacterToMemory(character: any) {
    throw new Error("Function not implemented.");
  }
  