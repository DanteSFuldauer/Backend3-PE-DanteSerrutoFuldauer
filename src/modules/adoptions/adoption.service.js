import { NotFoundError } from "../../common/errors/errors.js";
import { petDao } from "../pets/pet.dao.js";
import { userDao } from "../users/user.dao.js";
import { adoptionDao } from "./adoption.dao.js";

class AdoptionService {
  //Retorna todas las adopciones
  async getAllAdoptions() {
    return await adoptionDao.getAll();
  }

  //Retorna una adopción
  async getAdoption(query) {
    const adoption = await adoptionDao.getOne(query);

  //Manejo de error
  if (!adoption) throw new NotFoundError("Adopción no encontrada");

    return adoption;
  }

  //Crea una adopcion con id de usr y pet
  async createAdoption(ownerId, petId) {
    const pet = await petDao.getOne({ _id: petId });

    //Manejo de errores
    if (!pet) throw new NotFoundError("Mascota no encontrada");
    if (pet.adopted) throw new NotFoundError("La mascota ya a sido adoptada");

    const user = await userDao.getOne({ _id: ownerId });
    if (!user) throw new NotFoundError("Usuario no encontrado");

    // Creamos la adopción
    const adoption = await adoptionDao.create({ owner: ownerId, pet: petId });

    // Actualizar el estado de adopción del pet
    await petDao.update(pet._id, { adopted: true, owner: user._id });

    // Actualizar la lista de mascotas del usuario
    const updatePets = [...user.pets, { _id: pet._id }];
    await userDao.update(user._id, { pets: updatePets });

    return adoption;
  }
}

export const adoptionService = new AdoptionService();