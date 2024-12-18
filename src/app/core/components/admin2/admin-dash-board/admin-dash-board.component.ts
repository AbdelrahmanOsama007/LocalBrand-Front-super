import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-admin-dash-board',
  standalone: true,
  imports: [
    RouterModule,CommonModule
  ],
  templateUrl: './admin-dash-board.component.html',
  styleUrl: './admin-dash-board.component.css',
})
export class AdminDashBoardComponent {
GoToOrders(arg0: string) {
throw new Error('Method not implemented.');
}
toggleOrderTypes() {
throw new Error('Method not implemented.');
}
  constructor(private router: Router){}
  GoToProductCruds(){
    this.router.navigate(['/productcrud']);
  }
  GoToOrderCruds(){
    this.router.navigate(['/ordercrud']);
  }
  GoToCategoryCruds(){
    this.router.navigate(['/catcrud']);
  }
  GoToEmailCruds(){
    this.router.navigate(['/emailcrud']);
  }
}