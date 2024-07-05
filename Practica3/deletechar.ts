import { CharModel } from "./mongoosedata.ts";

// Eliminar un personaje según su ID
export const deleteChar = async (id: number) => {
  try {
    const result = await CharModel.deleteOne({ id: id }).exec();
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error al eliminar el personaje:", error);
    return false;
  }
};
