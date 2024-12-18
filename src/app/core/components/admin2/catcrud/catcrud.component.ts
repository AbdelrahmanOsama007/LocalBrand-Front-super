import { Component } from '@angular/core';
import { ICategory, ICategoryResponse, ISubCategory } from '../../../interfaces/ICatadmin';
import { CategoryService } from '../../../services/category-admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-catcrud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './catcrud.component.html',
  styleUrl: './catcrud.component.css',
})
export class CatcrudComponent {
  categories: ICategory[] = [];
  selectedCategory: ICategory | null = null;
  showModal: boolean = false;
  showUpdateModal: boolean = false;
  newCategory: ICategory = {
    categoryId: 0,
    categoryName: '',
    subCategories: [],
  };
  newSubCategory: ISubCategory = {
    subCategoryId: 0,
    subCategoryName: '',
    categoryId: 0,
  };
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  productImages: any;
  productForm: any;
  fb: any;
  isEdit: boolean = false;
  isEditProductModalVisible: boolean = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  filteredCategories(): ICategory[] {
    const filtered = this.categories.filter((category) =>
      category.categoryName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(
      this.categories.filter((category) =>
        category.categoryName
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      ).length / this.itemsPerPage
    );
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  addCategoryAndSubCategory(): void {
    if (this.newCategory.categoryName.trim() === '') {
      alert('Category name is required!');
      return;
    }

    if (this.newSubCategory.subCategoryName.trim() === '') {
      alert('Subcategory name is required!');
      return;
    }

    // Add the subcategory to the category
    this.newCategory.subCategories.push(this.newSubCategory);

    // Call the service to add the new category (with the subcategory)
    this.categoryService.addCategory(this.newCategory).subscribe({
      next: (result) => {
        if (result.success) {
          this.loadCategories(); // Reload categories after adding
          alert('Category and Subcategory added successfully!');
          this.resetAddForm(); // Reset form after successful addition
        } else {
          alert('Failed to add category and subcategory: ' + result.message);
        }
      },
      error: (err) => {
        console.error('Error adding category and subcategory:', err);
        alert('An error occurred while adding the category and subcategory.');
      },
    });
  }

  // Reset form after successful addition
  resetAddForm(): void {
    this.newCategory = { categoryId: 0, categoryName: '', subCategories: [] };
    this.newSubCategory = {
      subCategoryId: 0,
      subCategoryName: '',
      categoryId: 0,
    };
    this.showModal = false; // Close the modal
  }

  // Open the Add Category Modal
  openAddModal(): void {
    this.showModal = true;
  }

  // Close the Add Category Modal
  closeModal(): void {
    this.showModal = false;
  }

  // Open modal for editing an existing category
  openUpdateModal(category: ICategory): void {
    // Initialize selectedCategory if it's null or undefined
    this.selectedCategory = this.selectedCategory || {
      categoryId: 0,
      categoryName: '',
      subCategories: [],
    };

    // Clone the category to avoid mutation
    this.selectedCategory = { ...category };

    // Open the update modal
    this.showUpdateModal = true;
  }

  // Method to close the update modal
  closeUpdateModal(): void {
    this.showUpdateModal = false;
  }

  // Method to update the category
  updateCategory(): void {
    if (this.selectedCategory === null) {
      alert('No category selected for update.');
      return;
    }

    this.categoryService
      .updateCategory(this.selectedCategory.categoryId, this.selectedCategory)
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            alert('Category updated successfully!');
            this.closeUpdateModal();
          } else {
            alert('Failed to update category: ' + result.message);
          }
        },
        error: (err) => {
          console.error('Error updating category:', err);
          alert('An error occurred while updating the category.');
        },
      });
  }

  // Delete category
  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: (result: ICategoryResponse) => {
          if (result.success) {
            this.loadCategories(); // Reload categories after deleting
            alert('Category deleted successfully!');
          } else {
            alert('Failed to delete category: ' + result.message);
          }
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('An error occurred while deleting the category.');
        },
      });
    }
  }
}
