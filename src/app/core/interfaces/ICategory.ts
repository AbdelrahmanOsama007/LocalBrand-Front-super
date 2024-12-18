import { ISubcategory } from "./ISubcategory";

export interface ICategory{
    categoryId: number;
    categoryName: string;
    subCategories: ISubcategory[];
}