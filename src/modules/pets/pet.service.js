import { NotFoundError } from "../../common/errors/errors.js";
import { generatePetsMocks } from "../../mock/pets.mocks.js";
import { petDao } from "./pet.dao.js";

class PetService{
  async create(data){
   
    throw new NotFoundError(); //lanzamos error pesonalizado
  }

  async getOne(query) {
    const pet = await petDao.getOne(query);
    if(!pet) throw new NotFoundError("Pet not found"); //si no existe el pet da error

    return pet; //sino retornamos el pet
  }

  async createPetsMocks(amount) {
    const pets = generatePetsMocks(amount);
    await petDao.removeAll();
    for(const pet of pets){
      await petDao.create(pet);
    }

    return pets;
  }

}

export const petService = new PetService();