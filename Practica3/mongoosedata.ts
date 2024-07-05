import express, { Request, Response} from "npm:express@4.18.2"
import mongoose from "npm:mongoose@7.6.3";

const collection = 'characters';

type Character = {
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    origin: Origen;
    location: Origen;
    created: string;
  };
type Origen = {
    name: string;
    url: string;
  };

const nuevoPersonaje: Character = {
    id: 1,
    name: 'Ejemplo',
    status: 'Vivo',
    species: 'Humano',
    gender: 'Masculino',
    origin: { name: 'Origen', url: 'URL' },
    location: { name: 'Locación', url: 'URL' },
    created: '2023-10-27',
  };
 
export const CharModel = mongoose.model<Character>(
  'Character', 
  new mongoose.Schema<Character>({
    id: Number,
    name: String,
    status: String,
    species: String,
    gender: String,
    origin: {
        name: String,
        url: String,
      },
      location: {
        name: String,
        url: String,
      },
    created: String,
  }),
  collection // Variable con el nombre de la colección
  );

  type Localizacion1 = {
    id: number;
    location: Origen;
    created: string;
  };
  
  export const LocationModel = mongoose.model<Localizacion1>(
    "Location",
    new mongoose.Schema<Localizacion1>({
      id: Number,
      location: {
        name: String,
        url: String,
      },
      created: String,
    })
  );

