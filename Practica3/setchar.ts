import { CharModel } from "./mongoosedata.ts";
import { Character } from "./types.ts";

export const addPersonaje = async (character: Character): Promise<void> => {
  try {
    const newCharacter = new CharModel(character);
    await newCharacter.save();
  } catch (error) {
    console.error("Error al almacenar el personaje en MongoDB:", error);
    throw error;
  }
};
