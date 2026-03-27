import type { GeneralResponse } from "../core/models/general.model";
import type { Pet, PetStatus } from "../core/models/pet.model";
import { api } from "../lib/axios";

export const petService = {
  async findByStatus(statuses: PetStatus[]): Promise<Pet[]> {
    const res = await api.get<Pet[]>("/pet/findByStatus", {
      params: { status: statuses.join(",") },
    });
    return res.data;
  },

  async findById(id: number): Promise<Pet> {
    const res = await api.get<Pet>(`/pet/${id}`);
    return res.data;
  },

  async addPet(pet: Pet): Promise<Pet> {
    const res = await api.post<Pet>("/pet", pet);
    return res.data;
  },

  async updatePet(pet: Pet): Promise<Pet> {
    const res = await api.put<Pet>("/pet", pet);
    return res.data;
  },

  async deletePet(id: number): Promise<GeneralResponse> {
    const res = await api.delete<GeneralResponse>(`/pet/${id}`);
    return res.data;
  },

  async uploadImage(petId: number, file: File): Promise<GeneralResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<GeneralResponse>(
      `/pet/${petId}/uploadImage`,
      formData,
    );
    return res.data;
  },
};
