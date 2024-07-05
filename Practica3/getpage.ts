// getpage.ts

import { Character } from "./types.ts";

type Page = {
  info: string;
  results: Character[];
};

export const GetPag = async (pageNumber: number): Promise<Page> => {
  const url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const characters: Character[] = data.results.map((result: any) => ({
      id: result.id,
      name: result.name,
      status: result.status,
      species: result.species,
      gender: result.gender,
      origin: {
        name: result.origin.name,
        url: result.origin.url,
      },
      location: {
        name: result.location.name,
        url: result.location.url,
      },
      created: result.created,
      // Añade más campos si es necesario
    }));

    return {
      info: data.info,
      results: characters,
    };
  } catch (error) {
    console.error("Error al obtener la página de personajes:", error);
    throw error;
  }
};