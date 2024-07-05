// deleteallchar.ts
import { CharModel } from "./mongoosedata.ts";

// Eliminar todos los personajes
export const deleteAllCharFromDB = async () => {
  try {
    const result = await CharModel.deleteMany({}).exec();
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error al eliminar todos los personajes:", error);
    return false;
  }
};
