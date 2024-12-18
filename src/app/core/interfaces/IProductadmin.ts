// Interface for retrieved products
export interface IProductadmin {
  id: number; // Optional for creating a product
  name: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number;
  discount: number;
  summary:string;
  fullDescription: string;
  subCategoryId: number;
  subCategoryName: string;
  bestSeller: boolean;
  isOutOfStock: boolean;
  colorImages: { colorId: number; colorCode: string; imageUrls: string[] }[];
  sizesAndColorsQuantity?: {
    sizeId: string;
    sizeName: string;
    colorId: number;
    quantity: number;
  }[];
  stocks: { sizeId: number; colorId: number; quantity: number }[];
  images: { colorId: number; colorCode: string; imageUrls: string[] }[];
}

// Interface for creating products (without `id`)

export interface IColor {
  id: number;
  colorName: string;
  colorCode: string;
}

export interface ISize {
  id: number;
  sizeName: string;
  sizeKey: string;
}