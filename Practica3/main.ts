import mongoose from "npm:mongoose@7.6.3"
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts"

import { GetChar, getAllCharsFromDB, getAllCharFromRnMtoDB, filterCharStatAndGender, getCharByObjectId } from "./getchar.ts";
import { CharModel} from "./mongoosedata.ts";
import { GetPag } from "./getpage.ts";
import { addPersonaje} from "./setchar.ts";
import { deleteChar } from "./deletechar.ts";

import express, { Request, Response} from "npm:express@4.18.2"
import { deleteAllCharFromDB } from "./deleteallchar.ts";

const env = await load();
const URL_MONGO = "mongodb+srv://rcbusd:315raqHkLSJHekZl@arquitecturaysistemas.qpexaci.mongodb.net/extraordianrio?retryWrites=true&w=majority&appName=ArquitecturaySistemas"

//const URL_MONGO = env.MONGO_URL || Deno.env.get("MONGO_URL")

if(!URL_MONGO){
  console.error("Debes definir la variable URL_MONGO")
  Deno.exit(1)
}
console.info(URL_MONGO)
try {

  await mongoose.connect(URL_MONGO)
  console.info("Conexion buena")

  const api1  = express()
  api1.use(express.json())
  api1
  .delete("/mongo/deleteChar", async (req: Request, res: Response) => {
    try {
      const charId = Number(req.query.id); // Obtener ID del personaje desde los query parameters
      if (isNaN(charId) || charId <= 0) {
        res.status(400).send("ID de personaje no válido.");
        return;
      }
      
      const deleted = await deleteChar(charId);
      if (deleted) {
        res.status(200).send(`Personaje con ID ${charId} eliminado con éxito.`);
      } else {
        res.status(404).send(`Personaje con ID ${charId} no encontrado.`);
      }
    } catch (error) {
      console.error("Error al eliminar personaje:", error);
      res.status(500).send("Error al eliminar personaje.");
    }
  })

  .delete("/mongo/deleteAllChars", async (req: Request, res: Response) => {
    console.log("DELETE /mongo/deleteAllChars request received");
    try {
      const deleted = await deleteAllCharFromDB();
      if (deleted) {
        res.status(200).send("Todos los personajes han sido eliminados con éxito.");
      } else {
        res.status(404).send("No había personajes en la base de datos para eliminar.");
      }
    } catch (error) {
      console.error("Error al eliminar todos los personajes:", error);
      res.status(500).send("Error al eliminar todos los personajes.");
    }
  })

.get("/mongo/getcharbyobjectid/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const character = await getCharByObjectId(id);

    if (character) {
      res.json(character);
    } else {
      res.status(404).json({ message: `Personaje con ObjectId ${id} no encontrado en la base de datos.` });
    }
  } catch (error) {
    console.error("Error al obtener el personaje por ObjectId:", error);
    res.status(500).send("Error al obtener el personaje por ObjectId.");
  }
})

.post("/mongo/storeChars", async (req: Request, res: Response) => {
  try {
    const pageNumber = Number(req.query.pageNumber); // Obtener número de página desde los query parameters
    const characters = await GetPag(pageNumber);

    if (characters && characters.results.length > 0) {
      for (const character of characters.results) {
        await addPersonaje(character); // Almacena cada personaje en MongoDB
      }
      res.status(200).send("Personajes almacenados en MongoDB.");
    } else {
      res.status(404).send("No se encontraron personajes en la página especificada.");
    }
  } catch (error) {
    console.error("Error al almacenar personajes en MongoDB:", error);
    res.status(500).send("Error al almacenar personajes en MongoDB.");
  }
})

.post("/mongo/storeCharacters/:pageNumber", async (req: Request, res: Response) => {
  try {
    const pageNumber = Number(req.params.pageNumber);
    const characters = await GetPag(pageNumber);

    if (characters && characters.results.length > 0) {
      for (const character of characters.results) {
        await addPersonaje(character); // Almacena cada personaje en MongoDB
      }
      res.status(200).send("Personajes almacenados en MongoDB.");
    } else {
      res.status(404).send("No se encontraron personajes en la página especificada.");
    }
  } catch (error) {
    console.error("Error al almacenar personajes en MongoDB:", error);
    res.status(500).send("Error al almacenar personajes en MongoDB.");
  }
})

  //Guardar todos los personajes que faltan de la base de datos(Memoria interna) para pruebas FUNCIONA
  .get("/storeAllCharactersInMemory", async (req: Request, res: Response) => {
    try {
      await getAllCharFromRnMtoDB();
      res.send("Personajes almacenados en memoria interna (MongoDB).");
    } catch (error) {
      res.status(500).send("Error al almacenar personajes en memoria interna.");
    }
  })
  
  //Borrar todos los personajes de la base de datos(Memoria interna) para pruebas FUNCIONA
  .get("/deleteAllCharacters", async (req: Request, res: Response) => {
    try {
      const deleted = await deleteAllCharFromDB();
      if (deleted) {
        res.status(200).json({ message: "Todos los personajes han sido eliminados de la base de datos." });
      } else {
        res.status(200).json({ message: "No había personajes en la base de datos para eliminar." });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar personajes de la base de datos." });
    }
  })
  //Sacar todos los caracteres en la base de datos FUNCIONA
  .get("/characters", async (req: Request, res: Response) => {
    
    const characters = await getAllCharsFromDB();
    
    if (characters.length > 0) {
      res.json(characters);
    } else {
      res.status(404).send("No se encontraron personajes en la base de datos o hubo un error.");
    }
  })
  //Sacar por paginas los nombres FUNCIONA
  .get("/mongo/getpag/names/:pageNumber", async (req: Request, res: Response) => {
    try {
      const pageNumber = Number(req.params.pageNumber);
      const characters = await GetPag(pageNumber);
      
      if (characters && characters.results) {
        const characterNames = characters.results.map((character) => character.location);
        res.json(characterNames);
      } else {
        res.status(404).send("No se encontraron personajes en la página especificada.");
      }
    } catch (error) {
      console.error("Error al obtener nombres de personajes:", error);
      res.status(500).send("Error al obtener nombres de personajes.");
    }
  })
  //Devuelve el un personaje segun su id FUNCIONA
  .get("/getchar/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.send("ID de personaje no valido.");
        return;
      }
      const personaje = await CharModel.findOne({ id: id }).exec();
      if (personaje) {
        res.json(personaje);
      }else{
        const character = await GetChar(id);
  
        if (character) {
          await addPersonaje(character);
          res.json(character);
        } else {
          res.send("Personaje no encontrado.");
        }
      }

    } catch (error) {
      res.send("Error al obtener y guardar el personaje.");
    }
  })
  //borrar un caracter de la base de datos
  .get("/deletechar/:id", async (req: Request, res: Response) => {
    const charId = Number(req.params.id);
    try{
    const deleted = await deleteChar(charId);
  
    if (deleted) {
      res.json({ message: `Personaje con ID ${charId} eliminado con éxito` });
    } else {
      res.status(404).send(`Personaje con ID ${charId} no encontrado o error al eliminarlo.`);
    }
  }catch(e){
    res.status(404).send("no se pudo comprobar")
  }
  })
  //Muestra un caracter de la base de datos
  .get("/mongo/getchar/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const character = await getCharFromDB(id);

      if (character) {
        res.json(character);
      } else {
        res.status(404).json({ message: `Personaje con ID ${id} no encontrado en la base de datos.` });
      }
    } catch (e) {
      res.status(500).send(e);
    }
  })
  //filtrar caracteres segun su id id=1 alive and male id=2 alive and female id = 3 dead and male id = 4 dead and female
  .get('/filterCharacters/:id', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
  
      if (isNaN(id) || id < 1 || id > 4) {
        res.status(400).send('ID de filtro no válido');
        return;
      }
      let status = 'N/A';
      let gender = 'N/A';
  
      if (id === 1) {
        status = 'Alive';
        gender = 'Male';
      } else if (id === 2) {
        status = 'Alive';
        gender = 'Female';
      } else if (id === 3) {
        status = 'Dead';
        gender = 'Male';
      } else if (id === 4) {
        status = 'Dead';
        gender = 'Female';
      }
      const filteredCharacters = await filterCharStatAndGender(status, gender);
  
      if (filteredCharacters.length > 0) {
        res.json(filteredCharacters);
      } else {
        res.status(404).send('No se encontraron personajes que coincidan con los criterios de filtro.');
      }
    } catch (error) {
      res.status(500).send('Error al filtrar personajes.');
    }
  })

  const port = 3000;
  api1.listen(port, () => {
    console.log("Puerto listo");
  });
} catch (e) {
  console.error("No se ha podido conectar")
}

function getCharFromDB(id: number) {
  throw new Error("Function not implemented.");
}
