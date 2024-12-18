import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IEmail } from '../../../interfaces/IEmail';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  emailobject: IEmail = {email: ''};
  constructor(private router: Router,private toastr: ToastrService, private _adminAuth: AdminAuthService){}
  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/home' } });
  }
  GoToLogin(){
    this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000'])
  }
  onSubmit(event : any , resetPasswordForm:NgForm){
    if(resetPasswordForm.invalid){
      event.stopPropagation();
      resetPasswordForm.control.markAllAsTouched();
    }
    else{
      this._adminAuth.ForgetPassword(resetPasswordForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: "Success",
            text: "Check your email",
            icon: "success"
          });
          this.GoToLogin();
        },
        error: () => {
          this.GoToError();
        }
      })
    }
   }
}
