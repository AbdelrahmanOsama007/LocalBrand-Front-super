// Interface for SubCategory
export interface ISubCategory {
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;  // This ties the subcategory to the category
}

// Interface for Category
export interface ICategory {
  categoryId: number;
  categoryName: string;
  subCategories: ISubCategory[];  // List of subcategories under this category
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
