// Interface for SubCategory
export interface ISubCategory {
  subCategoryId: number; // Subcategory ID
  subCategoryName: string; // Subcategory name
}
// Interface for Category
export interface ICategory {
  categoryId: number; // Category ID
  categoryName: string; // Category name
  subCategories: ISubCategory[]; // List of subcategories under this category
}
// Interface for API Response
export interface ICategoryResponse {
  success: boolean;
  message?: string;
  developMessage?: string;
  data?: ICategory[];
  additionalData?: number;
  quantityLeek?: boolean;
  onlinePaymentStatus?: boolean;
  orderAdditionalData?: any;
}
