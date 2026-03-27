import type { Category } from "../core/models/pet.model";

const DUMMY_CATEGORIES: Category[] = [
  { id: 1, name: "Dog" },
  { id: 2, name: "Cat" },
  { id: 3, name: "Bird" },
  { id: 4, name: "Fish" },
  { id: 5, name: "Rabbit" },
  { id: 6, name: "Hamster" },
  { id: 7, name: "Reptile" },
  { id: 8, name: "Other" },
];

export const categoryService = {
  async getLovCategory(): Promise<Category[]> {
    return DUMMY_CATEGORIES;
  },
};
