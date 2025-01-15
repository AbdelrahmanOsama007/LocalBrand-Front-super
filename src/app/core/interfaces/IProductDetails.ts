import { IColorImage } from "./IColorImage";
import { ISizeColorQuantity } from "./ISizeColorQuantity";

export interface IProductDetails {
    id: number;
    name: string;
    summary: string;
    fullDescription: string;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    discount: number;
    subCategoryId: number;
    categoryId: number;
    categoryName: string;
    colorImages: IColorImage[];
    isOutOfStock: boolean;
    sizesAndColorsQuantity: ISizeColorQuantity[];
}