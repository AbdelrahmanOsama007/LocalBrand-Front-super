import { Component } from '@angular/core';
import { IOrder } from '../../../interfaces/IOrderAdmin';
import { OrderadminService } from '../../../services/orderadmin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { ProductService } from '../../../services/product.service';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import {
  IColor,
  IProductadmin,
  ISize,
} from '../../../interfaces/IProductadmin';
import { IProduct } from '../../../interfaces/IProduct';

@Component({
  selector: 'app-order-crud',
  standalone: true,
  imports: [FormsModule, CommonModule, EgpCurrencyPipe],
  templateUrl: './order-crud.component.html',
  styleUrl: './order-crud.component.css',
})
export class OrderCrudComponent {
  orders: IOrder[] = [];
  deliveredOrders: IOrder[] = [];
  processingOrders: IOrder[] = [];
  selectedOrder: IOrder | null = null;
  cancelledOrders: IOrder[] = [];
  isEditMode: boolean = false; // To track if we are editing or viewing an order
  showModal: boolean = false;
  showUpdateModal: boolean = false;
  availableColors: IColor[] = [];
  availableSizes: ISize[] = [];
  selectedproduct!: IProductadmin;
  productName: string = ' ';
  private productMap: Map<number, string> = new Map();

  constructor(
    private _OrderService: OrderadminService,
    private productservices: ProductService
  ) {}

  ngOnInit(): void {
    this._OrderService.GetAllOrders().subscribe({
      next: (result) => {
        if (result.success && Array.isArray(result.data)) {
          this.orders = result.data; // Store all orders

          // Filter orders based on status
          this.deliveredOrders = this.orders.filter(
            (order) => order.orderStatus === 0
          );
          this.cancelledOrders = this.orders.filter(
            (order) => order.orderStatus === 1
          );
          this.processingOrders = this.orders.filter(
            (order) => order.orderStatus === 2
          );
        } else {
          console.error('Failed to fetch orders:', result.message);
        }
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
    this.loadColors();
    this.loadSizes();
    this.loadProducts();
  }
  viewOrder(order: IOrder): void {
    this.selectedOrder = order;
    this.showModal = true;
  }

  // Close the modal
  closeModal(event?: MouseEvent): void {
    this.showModal = false;
  }

  ///////////////////////////////
  openUpdateModal(order: IOrder): void {
    this.selectedOrder = { ...order }; // Clone the order object to avoid direct mutation
    this.showUpdateModal = true;
  }

  // Close the Update Modal
  closeUpdateModal(): void {
    this.selectedOrder = null;
    this.showUpdateModal = false;
  }

  // Update the Order
  updateOrder(): void {
    if (this.selectedOrder) {
      this.selectedOrder.orderStatus = +this.selectedOrder.orderStatus;
      this._OrderService.UpdateOrder(this.selectedOrder).subscribe({
        next: (result) => {
          if (result.success) {
            alert('Order updated successfully!');
            this.closeUpdateModal();
            this.refreshOrders(); // Refresh the orders list
          } else {
            alert('Failed to update order: ' + result.message);
          }
        },
        error: (err) => {
          console.error('Error updating order:', err);
          alert('An error occurred. Please try again.');
        },
      });
    }
  }

  // Refresh Orders List
  refreshOrders(): void {
    this._OrderService.GetAllOrders().subscribe({
      next: (result) => {
        if (result.success && Array.isArray(result.data)) {
          this.orders = result.data;
        }
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  deleteOrder(order: IOrder): void {
    if (confirm(`Are you sure you want to delete order #${order.orderId}?`)) {
      this._OrderService.DeleteOrder(order.orderId).subscribe({
        next: (result) => {
          if (result.success) {
            alert('Order deleted successfully!');
            this.refreshOrders();
          } else {
            alert('Failed to delete order: ' + result.message);
          }
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          alert('An error occurred. Please try again.');
        },
      });
    }
  }

  // Getproductbyid(productId: number): void {
  //   this.productservices.GetProductById(productId).subscribe({
  //     next: (response: IOperationResult) => {
  //       if (response.success) {
  //         this.selectedproduct = response.data as IProductadmin;
  //         this.productName = this.selectedproduct.name; // Store the product name
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching product details:', err);
  //     },
  //   });
  // }

  loadColors(): void {
    this.productservices.GetAllColors().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableColors = response.data;
        }
      },
      error: (err) => console.error('Error fetching colors:', err),
    });
  }

  loadSizes(): void {
    this.productservices.GetAllSizes().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableSizes = response.data; // Populate dropdown data
        }
      },
      error: (err) => console.error('Error fetching sizes:', err),
    });
  }

  getColorName(colorId: number): string {
    const color = this.availableColors.find((c) => c.id === colorId);
    return color ? color.colorName : 'Unknown';
  }

  getSizeName(sizeId: number): string {
    const size = this.availableSizes.find((s) => s.id === sizeId);
    return size ? size.sizeName : 'Unknown';
  }
  loadProducts(): void {
    this.productservices.GetAllProducts().subscribe({
      next: (response) => {
        if (Array.isArray(response.data)) {
          response.data.forEach((product: IProductadmin) => {
            this.productMap.set(product.id, product.name);
          });
        } else {
          console.error('response.data is not an array:', response.data);
        }
      },
    });
  }

  getProductName(productId: number): string {
    return this.productMap.get(productId) || 'Unknown';
  }
}
