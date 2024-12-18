import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../../interfaces/IOrderAdmin';
import { OrderadminService } from '../../../services/orderadmin.service';
import { FormsModule } from '@angular/forms';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivered-products',
  standalone: true,
  imports: [FormsModule,EgpCurrencyPipe,CommonModule],
  templateUrl: './delivered-products.component.html',
  styleUrl: './delivered-products.component.css',
})
export class DeliveredProductsComponent implements OnInit {
  deliveredOrders: IOrder[] = [];

  constructor(private orderService: OrderadminService) {}

  ngOnInit(): void {
    this.loadDeliveredOrders();
  }

  loadDeliveredOrders(): void {
    this.orderService.GetAllOrders().subscribe({
      next: (result) => {
        if (result.success && Array.isArray(result.data)) {
          this.deliveredOrders = result.data.filter(
            (order) => order.orderStatus === 0
          );
        } else {
          console.error('Failed to fetch delivered orders:', result.message);
        }
      },
      error: (err) => {
        console.error('Error fetching delivered orders:', err);
      },
    });
  }
}

