import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import {
  IColor,
  IProductadmin,
  ISize,
} from '../../../interfaces/IProductadmin';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { CategoryService } from '../../../services/category-admin.service';
import { CloudinaryModule } from '@cloudinary/ng';
import { ICategory, ISubCategory } from '../../../interfaces/ICatadmin';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productscrud',
  templateUrl: './productscrud.component.html',
  styleUrls: ['./productscrud.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CloudinaryModule,
    EgpCurrencyPipe,
    NgTemplateOutlet,
  ],
})
export class ProductscrudComponent implements OnInit {
  products: IProductadmin[] = [];
  categories: ICategory[] = [];
  availableColors: IColor[] = []; // Store colors from API
  availableSizes: ISize[] = []; // Store sizes from API
  productForm!: FormGroup;
  isEditMode: boolean = false;
  selectedProduct!: IProductadmin;
  isEdit: boolean = false;
  isAddProductModalVisible: boolean = false;
  isEditProductModalVisible: boolean = false;
  productImages: string[][] = [];
  selectedColors: any[] = [];
  selectedSizes: any[] = [];
  colors: { colorCode: string; colorName: string }[] = [];
  sizes: { size: string; quantity: number }[] = [];
  product: any;
  flag: boolean = true;
  isModalVisible: any;
  availableCategories: ICategory[] = [];
  availableSubCategories: any;
  subCategories: ISubCategory[] = [];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private catservices: CategoryService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.productService.imageUpload$.subscribe(
      (data: { imagePreviews: any[]; index: number }) => {
        this.flag = false;
        this.productService.uploadImage(data.imagePreviews).subscribe({
          next: (res: any) => {
            console.log('Upload successful. Response:', res);
            if (Array.isArray(this.productImages[data.index])) {
              this.productImages[data.index].push(...res);
            } else {
              // If it's not an array, initialize it as an array and then push
              this.productImages[data.index] = res;
            }
            this.flag = true;
            this.productImages = [...this.productImages];
            // Handle the response (e.g., store the image URL)
          },
          error: (err) => {
            console.error('Upload failed:', err);
          },
        });
      }
    );
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: [],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
          Validators.pattern(/^[a-zA-Z\s\-]+$/), // Letters, spaces, hyphens
        ],
      ],
      summary: ['', [Validators.required, Validators.maxLength(300)]], // New field
      fullDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(800),
        ],
      ],
      price: [
        null,
        [Validators.required, Validators.min(0.01)], // Positive decimal
      ],
      discount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      bestSeller: [true],
      subCategoryId: [
        null,
        [Validators.required, Validators.min(1)], // Positive integer
      ],
      stocks: this.fb.array([]),
      images: null,
    });

    this.loadProducts();
    this.loadColors();
    this.loadSizes();
    this.addStock();
    this.loadCategories();
  }

  // Load all products
  loadProducts(): void {
    this.productService.GetAllProducts().subscribe({
      next: (result: IOperationResult) => {
        if (result.success) {
          this.products = result.data as IProductadmin[];
        } else {
          console.error('Failed to load products:', result.message);
        }
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  // Open the modal for adding a product
  openAddModal(): void {
    this.isEditMode = false;
    this.productForm.reset();
    this.showModal();
  }
  showModal(): void {
    this.isAddProductModalVisible = true; // Set the visibility flag to true, opening the modal
  }

  closeModal(): void {
    this.isAddProductModalVisible = false; // Set the visibility flag to false, closing the modal
    this.isModalVisible = false;
    this.productForm.reset();
    this.productImages = [];
  }

  // Save the product (add or edit)
  saveProduct(): void {
    if (this.productForm.invalid) {
      const errors = [];

      // Validate 'name'
      if (this.productForm.get('name')?.invalid) {
        if (this.productForm.get('name')?.hasError('required')) {
          errors.push('Name is required.');
        }
        if (this.productForm.get('name')?.hasError('minlength')) {
          errors.push('Name must be at least 5 characters long.');
        }
        if (this.productForm.get('name')?.hasError('maxlength')) {
          errors.push('Name cannot exceed 150 characters.');
        }
        if (this.productForm.get('name')?.hasError('pattern')) {
          errors.push('Name can only contain letters, spaces, and hyphens.');
        }
      }

      // Validate 'summary'
      if (this.productForm.get('summary')?.invalid) {
        if (this.productForm.get('summary')?.hasError('required')) {
          errors.push('Summary is required.');
        }
        if (this.productForm.get('summary')?.hasError('maxlength')) {
          errors.push('Summary cannot exceed 300 characters.');
        }
      }

      // Validate 'fullDescription'
      if (this.productForm.get('fullDescription')?.invalid) {
        if (this.productForm.get('fullDescription')?.hasError('required')) {
          errors.push('Full description is required.');
        }
        if (this.productForm.get('fullDescription')?.hasError('minlength')) {
          errors.push('Full description must be at least 20 characters long.');
        }
        if (this.productForm.get('fullDescription')?.hasError('maxlength')) {
          errors.push('Full description cannot exceed 800 characters.');
        }
      }

      // Validate 'price'
      if (this.productForm.get('price')?.invalid) {
        if (this.productForm.get('price')?.hasError('required')) {
          errors.push('Price is required.');
        }
        if (this.productForm.get('price')?.hasError('min')) {
          errors.push('Price must be a positive number greater than 0.');
        }
      }

      // Validate 'discount'
      if (this.productForm.get('discount')?.invalid) {
        if (this.productForm.get('discount')?.hasError('required')) {
          errors.push('Discount is required.');
        }
        if (this.productForm.get('discount')?.hasError('min')) {
          errors.push('Discount must be at least 0%.');
        }
        if (this.productForm.get('discount')?.hasError('max')) {
          errors.push('Discount cannot exceed 100%.');
        }
      }

      // Validate 'subCategoryId'
      if (this.productForm.get('subCategoryId')?.invalid) {
        if (this.productForm.get('subCategoryId')?.hasError('required')) {
          errors.push('Sub-category is required.');
        }
        if (this.productForm.get('subCategoryId')?.hasError('min')) {
          errors.push('Sub-category ID must be a positive number.');
        }
      }

      // Validate 'stocks' (if required logic exists)
      if (this.productForm.get('stocks')?.invalid) {
        errors.push('Stocks are not valid. Please check all entries.');
      }

      // Display errors using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        html: `<ul>${errors.map((err) => `<li>${err}</li>`).join('')}</ul>`,
        confirmButtonText: 'OK',
      });
      return;
    }

    // Transform stocks array to ensure sizeId and colorId are integers
    const formattedStocks = this.stocks.value.map((stock: any) => ({
      sizeId: parseInt(stock.sizeId, 10), // Ensure sizeId is an integer
      colorId: parseInt(stock.colorId, 10), // Ensure colorId is an integer
      quantity: stock.quantity,
    }));

    // Format images array
    const formattedImages = this.stocks.value.map(
      (images: any, index: number) => ({
        colorId: parseInt(this.stocks.value[index].colorId, 10), // Ensure colorId is an integer
        colorCode:
          this.availableColors.find(
            (c) => c.id === parseInt(this.stocks.value[index].colorId, 10)
          )?.colorCode || '#000000',
        imageUrls: Array.isArray(this.productImages[index])
          ? this.productImages[index]
          : [this.productImages[index]],
      })
    );

    const productData = {
      ...this.productForm.value,
      stocks: formattedStocks,
      images: formattedImages,
    };
    if (productData.bestSeller == null) {
      productData.bestSeller = false;
    }
    if (!this.isEditMode) {
      delete productData['id'];
    }
    console.log('Prepared productData:', productData);

    if (this.isEditMode) {
      this.productService.updateProduct(productData, productData.id).subscribe({
        next: (result: IOperationResult) => {
          if (result.success) {
            this.toastr.success('Product updated successfully.');
            this.loadProducts();
            this.closeModal();
          }
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.productImages = [];
        },
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: (result: IOperationResult) => {
          if (result.success) {
            this.toastr.success('Product added successfully.');
            this.loadProducts();
            this.closeModal();
          }
        },
        error: (err) => {
          console.error('Error adding product:', err);
          this.productImages = [];
        },
      });
    }
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.DeleteProduct(productId).subscribe(
        (response) => {
          // Successfully deleted, remove from the local product list
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
          this.toastr.success('Product deleted successfully.');
        },
        (error) => {
          console.error('Error deleting product', error);
          this.toastr.error('Failed to delete product.');
        }
      );
    }
  }
  ///////////////////////
  openProductModal(productId: number): void {
    this.productService.GetProductById(productId).subscribe({
      next: (response: IOperationResult) => {
        console.log('Full response:', response); // Log the entire response

        if (response.success) {
          this.selectedProduct = response.data as IProductadmin; // Store the product data
          console.log('Selected Product:', this.selectedProduct);
          this.isModalVisible = true; // Show the modal
        } else {
          console.error('Error fetching product details:', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      },
    });
  }

  loadColors(): void {
    this.productService.GetAllColors().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableColors = response.data;
        }
      },
      error: (err) => console.error('Error fetching colors:', err),
    });
  }

  loadCategories(): void {
    this.catservices.getAllCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.availableCategories = response.data; // Contains categories with subcategories

          // Explicitly type the reduce accumulator as ISubCategory[]
          this.subCategories = response.data.reduce<ISubCategory[]>(
            (acc: ISubCategory[], category) =>
              acc.concat(category.subCategories),
            []
          );

          console.log('All Subcategories:', this.subCategories);
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  onCategoryChange(categoryId: number): void {
    const selectedCategory = this.availableCategories.find(
      (category) => category.categoryId === categoryId
    );
    this.availableSubCategories = selectedCategory?.subCategories || [];
  }

  // Fetch all sizes
  loadSizes(): void {
    this.productService.GetAllSizes().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableSizes = response.data; // Populate dropdown data
        }
      },
      error: (err) => console.error('Error fetching sizes:', err),
    });
  }
  addColor() {
    this.colors.push({ colorCode: '', colorName: '' });
  }

  // Remove a color
  removeColor(index: number) {
    this.colors.splice(index, 1);
  }

  // Add a new size
  addSize() {
    this.sizes.push({ size: '', quantity: 0 });
  }

  // Remove a size
  removeSize(index: number) {
    this.sizes.splice(index, 1);
  }
  get stocks(): FormArray {
    return this.productForm.get('stocks') as FormArray;
  }
  addStock(): void {
    const stockGroup = this.fb.group({
      colorId: [null, Validators.required],
      sizeId: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });
    this.stocks.push(stockGroup);
  }

  removeStock(index: number): void {
    this.stocks.removeAt(index);
  }

  onImageChange(event: any, index: number): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const imagePreviews: string[] = []; // Array to hold multiple image previews

      // Loop through each file and create base64 string
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = () => {
          // Push the base64 result into the array
          imagePreviews.push(reader.result?.toString() ?? '');

          // Once all images are processed, emit the imagePreviews array
          if (imagePreviews.length === files.length) {
            this.productService.imageUpload.next({ imagePreviews, index }); // Emit multiple images
          }
        };

        reader.readAsDataURL(file); // Read each file as a base64 string
      }
    }
  }

  removeImage(index: number): void {
    this.productImages.splice(index, 1);
  }

  filterSizesByColor(colorId: number): any[] {
    return (
      this.selectedProduct?.sizesAndColorsQuantity?.filter(
        (size) => size.colorId === colorId
      ) || []
    );
  }

  displayeditmodal(id: number) {
    this.productService.GetProductById(id).subscribe((response) => {
      this.openAddModal();
      this.isEditMode = true;
      this.product = response.data;

      this.bindProductData(this.product);
    });
  }

  bindProductData(data: any) {
    this.productForm.get('name')?.setValue(data.name);
    this.productForm.get('summary')?.setValue(data.summary);
    this.productForm.get('fullDescription')?.setValue(data.fullDescription);
    this.productForm.get('price')?.setValue(data.priceBeforeDiscount);
    this.productForm.get('discount')?.setValue(data.discount);
    this.productForm.get('bestSeller')?.setValue(data.bestSeller);
    this.productForm.get('subCategoryId')?.setValue(data.subCategoryId);
    this.productForm.get('id')?.setValue(data.id);
    // Bind stocks
    const stocksFormArray = this.fb.array(
      data.sizesAndColorsQuantity.map((stock: any) =>
        this.fb.group({
          sizeId: [stock.sizeId, [Validators.required, Validators.min(1)]],
          colorId: [stock.colorId, [Validators.required, Validators.min(1)]],
          quantity: [stock.quantity, [Validators.required, Validators.min(0)]],
        })
      )
    );
    this.productForm.setControl('stocks', stocksFormArray);
    this.bindimages(data.colorImages);
    // Bind images
  }
  bindimages(
    colorImages: [{ colorId: number; colorCode: string; imageUrls: [] }]
  ) {
    colorImages.forEach((colorImage, index) => {
      this.productImages[index] = colorImage.imageUrls;
    });
    this.productImages = [...this.productImages];
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  deleteImage(stock: number, image: number): void {
    // Check if the stock index exists
    if (this.productImages[stock]) {
      // Remove the image at the specific index
      this.productImages[stock].splice(image, 1);

      // If no images are left for the stock, optionally remove the stock entry
      if (this.productImages[stock].length === 0) {
        this.productImages.splice(stock, 1);
      }

      // Trigger change detection by reassigning the array
      this.productImages = [...this.productImages];
    }
  }
  getValidationMessage(controlName: string): string {
    const messages: { [key: string]: string } = {
      required: 'This field is required.',
      minlength: 'Minimum length is not met.',
      maxlength: 'Maximum length exceeded.',
      pattern: 'Invalid format.',
      min: 'Value is too small.',
      max: 'Value is too large.',
    };

    return messages[controlName];
  }
}
