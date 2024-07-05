import { Character } from  "./types.ts";
import { CharModel } from "./mongoosedata.ts";


export const GetChar: (id: number) => Promise <Character> = async (id: number) : Promise <Character> =>{
    const url1  = `https://rickandmortyapi.com/api/character/${id}`
    const data: Response = (await fetch(url1))
    const charact= await data.json()
    
    return{
        id: charact.id, 
        name: charact.name,
        status: charact.status,
        species: charact.species,
        gender: charact.gender,
        origin: charact.origin,
        location: charact.location,
        created: charact.created,

    }
}

// Obtener un personaje por su _id (ObjectId)
export const getCharByObjectId = async (id: string) => {
  try {
    const character = await CharModel.findById(id).exec();
    return character;
  } catch (error) {
    console.error("Error al obtener el personaje por ObjectId:", error);
    return null;
  }
};

export async function getAllCharFromRnMtoDB() {
    try {
      const baseUrl = "https://rickandmortyapi.com/api/character";
      
      const totalPages = 34;
      for (let page = 1; page <= totalPages; page++) {
        const apiUrl = `${baseUrl}/?page=${page}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        for (const character of data.results) {
          const existingCharacter = await CharModel.findOne({ id: character.id }).exec();
          if (!existingCharacter) {
            const newCharacter = new CharModel({
              id: character.id,
              name: character.name,
              status: character.status,
              species: character.species,
              gender: character.gender,
              origin: character.origin,
              location: character.location,
              created: character.created,
            });
            await newCharacter.save();
          }
        }
      }
      console.log("Personajes almacenados en memoria interna (MongoDB).");
    } catch (error) {
      console.error("Error al obtener y almacenar los personajes:", error);
    }
    return;
  }

export async function getAllCharsFromDB() {
  try {
    const characters = await CharModel.find({}).exec();

    if (characters.length > 0) {
      return characters; 
    } else {
      console.log("No se encontraron personajes en la base de datos.");
      return []; 
    }
  } catch (error) {
    console.error("Error al obtener los personajes de la base de datos:", error);
    return [];
  }
}

export async function filterCharStatAndGender(status: string, gender: string): Promise<Character[]> {
  try {
    const filterOptions: Record<string, string> = {};

    if (status) {
      filterOptions.status = status;
    }

    if (gender) {
      filterOptions.gender = gender;
    }

    const filteredCharacters = await CharModel.find(filterOptions).exec();

    return filteredCharacters;
  } catch (error) {
    console.error('Error al filtrar personajes:', error);
    return [];
  }
}