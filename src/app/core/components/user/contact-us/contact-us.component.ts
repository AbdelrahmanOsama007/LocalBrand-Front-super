import { Component, OnDestroy } from '@angular/core';
import { IUserEmail } from '../../../interfaces/IUserEmail';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactUsService } from '../../../services/contact-us.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnDestroy {
  constructor(private _contactus: ContactUsService,private router: Router,private toastr: ToastrService){}
  subscription!: Subscription;
  UserEmail: IUserEmail = {Name:'' , Email:'' , Message:''};
  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/home' } });
  }
  onSubmit(event : any , UserEmailform:NgForm){
    if(UserEmailform.invalid){
      event.stopPropagation();
      UserEmailform.control.markAllAsTouched();
    }
    else{
      this.subscription = this._contactus.ContactUs(this.UserEmail).subscribe({
        next: () => {
          Swal.fire({
            title: "Success",
            text: "Email sent successfully",
            icon: "success"
          });
          UserEmailform.resetForm();
        },
        error: () => {
          this.GoToError();
        }
      })
    }
   }
   ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
