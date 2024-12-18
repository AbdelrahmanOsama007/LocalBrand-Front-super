import { Component } from '@angular/core';
import { AdminDashBoardComponent } from '../admin-dash-board/admin-dash-board.component';
import { ProductscrudComponent } from '../productscrud/productscrud.component';


@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [AdminDashBoardComponent,ProductscrudComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
})
export class AdminHomeComponent {}
