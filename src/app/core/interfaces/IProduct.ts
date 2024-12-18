export interface IProduct{
    id: number;
    name: string;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    subCategoryId: number;
    discount: number;
    images: string[];
    isOutOfStock: boolean
}