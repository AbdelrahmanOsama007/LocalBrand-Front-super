import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IUserinfo } from '../../../interfaces/IUserInfo';
import { EgpCurrencyPipe } from '../../../pipes/egp-currency.pipe';
import { ProductInfo } from '../../../models/productinfo';
import { CheckOutService } from '../../../services/check-out.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [FormsModule, EgpCurrencyPipe],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent implements OnInit {
  @ViewChild('onlinePaymentModal', { static: false }) onlinePaymentModal!: ElementRef;
  constructor(private toastr: ToastrService,private router: Router,private _checkoutservice:CheckOutService,private _cartservice: CartService, private _router:Router,@Inject(DOCUMENT) private document: Document){}
  subscription: Subscription[] = [];
  MainTotal = {Tot: 0 , Sub: 0};
  CartContent: ProductInfo[] = [];
  UserInfo!:IUserinfo;
  source!:string;
  isLoading: boolean = false;
  User: IUserinfo = {FirstName:'', LastName: '', City: '', StreetAddress:'', Appartment:'', PhoneNumber:'', Email:'', PaymentMethod: -1};
  ngOnInit(): void {
    const userStoredInfo = JSON.parse(sessionStorage.getItem('userinfo') || '{}');
    if (userStoredInfo) {
      this.User = {
        FirstName: userStoredInfo.firstName || '',
        LastName: userStoredInfo.lastName || '',
        Email: userStoredInfo.email || '',
        PhoneNumber: userStoredInfo.phoneNumber || '',
        City: userStoredInfo.city || '',
        StreetAddress: userStoredInfo.streetAddress || '',
        Appartment: userStoredInfo.appartment || '',
        PaymentMethod: userStoredInfo.paymentMethod ?? -1
      };
    }
    var TotalInfo = JSON.parse(localStorage.getItem('Total-info') || '');
    if(TotalInfo){
      this.MainTotal.Tot = TotalInfo.Tot;
      this.MainTotal.Sub = TotalInfo.Sub;
    }
    this.CartContent = JSON.parse(localStorage.getItem('cart') || '[]');
  }

onSubmit(event : any , checkoutform:NgForm){
  if(checkoutform.invalid){
    event.stopPropagation();
    checkoutform.control.markAllAsTouched();
  }
  else{
    if(this.User.PaymentMethod == 0){
      this.isLoading = true;
      const OrderObject = {
        firstName: this.User.FirstName,
        lastName: this.User.LastName,
        email: this.User.Email,
        phoneNumber: this.User.PhoneNumber,
        city: this.User.City,
        streetAddress: this.User.StreetAddress,
        appartment: this.User.Appartment,
        paymentMethod: this.User.PaymentMethod,
        products: this.CartContent
      }
      this.subscription.push(this._checkoutservice.ApplyOrder(OrderObject).subscribe({
        next: (result:IOperationResult) => {
          if(result.quantityLeek){
            this.isLoading = false;
            this.toastr.error(result.message);
            sessionStorage.setItem('userinfo',JSON.stringify(OrderObject));
            this.router.navigate(['/cart']);
          }
          if(result.data){
            this.isLoading = false;
            localStorage.removeItem('cart');
            localStorage.removeItem('Total-info');
            this._cartservice.UpdateHeaderValue(true);
            Swal.fire({
              title: "Success",
              text: "Ordered Successfully",
              icon: "success"
            });
            this.GoToHome();
          }
        },
        error: () => {
          this.isLoading = false;
          this.GoToError();
        }
      }))
    }
    else if (this.User.PaymentMethod == 1){
      this.isLoading = true;
      const OrderObject = {
        firstName: this.User.FirstName,
        lastName: this.User.LastName,
        email: this.User.Email,
        phoneNumber: this.User.PhoneNumber,
        city: this.User.City,
        streetAddress: this.User.StreetAddress,
        appartment: this.User.Appartment,
        paymentMethod: this.User.PaymentMethod,
        products: this.CartContent
      }
      this.subscription.push(this._checkoutservice.ApplyOrder(OrderObject).subscribe({
        next: (result:IOperationResult) => {
          if(result.quantityLeek){
            this.isLoading = false;
            this.toastr.error(result.message);
            sessionStorage.setItem('userinfo',JSON.stringify(OrderObject));
            this.router.navigate(['/cart']);
          }
          if(result.data){
            localStorage.removeItem('cart');
            localStorage.removeItem('Total-info');
            this._cartservice.UpdateHeaderValue(true);
            var webhookendpoint = 'https://eleve.runasp.net/api/WebHook/CompletePayment';
            this.source = `https://checkout.kashier.io/?merchantId=MID-29963-501&orderId=${result.orderAdditionalData.id}&amount=${result.orderAdditionalData.totalPrice}&currency=EGP&hash=${result.orderAdditionalData.hash}&mode=test&metaData={"metaData":"myData"}&merchantRedirect=https://verdant-granita-c77051.netlify.app/home&serverWebhook=${webhookendpoint}&allowedMethods=card,wallet&failureRedirect=false&redirectMethod=get&brandColor=%2300bcbc&display=en&type=external`;
            this.document.location.href = this.source;
            this.isLoading = false;
          }
        },
        error: () => {
          this.isLoading = false;
          this.GoToError();
        }
      }))
    }
  }
 }

GoToHome(){
  this.router.navigate(['/home'])
}
GoToError(){
  this.router.navigate(['/error'], { queryParams: { retryUrl: '/check-out' } });
}
 selectPaymentMethod(paymentMethod: number, event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.checked) {
    this.User.PaymentMethod = paymentMethod;
  } else {
    this.User.PaymentMethod = -1;
  }
}
}
