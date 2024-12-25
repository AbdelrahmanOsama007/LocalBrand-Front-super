import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IChangepassword } from '../../../interfaces/IChangepassword';
import { AdminAuthService } from '../../../services/admin-auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IChangePasswordCall } from '../../../interfaces/IChangePasswordCall';
import { TokenValidationService } from '../../../services/token-validation.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordobject : IChangepassword = {currentPassword : '', newPassword: '', confirmNewPassword: ''}
  ChangePasswordRequest: IChangePasswordCall = {currentPassword: '', newPassword: ''}
  invalidMessage: string = '';
  constructor(private _adminAuth: AdminAuthService, private router: Router, private _tokenservice:TokenValidationService){}
  onSubmit(event : any , changepasswordform:NgForm){
    if(changepasswordform.invalid){
      event.stopPropagation();
      changepasswordform.control.markAllAsTouched();
    }
    else if (!changepasswordform.invalid && this.changePasswordobject.currentPassword == this.changePasswordobject.newPassword){
      event.stopPropagation();
      this.invalidMessage = '';
      this.invalidMessage = "no changes made on password";
    }
    else{
      this.ChangePasswordRequest.currentPassword = this.changePasswordobject.currentPassword;
      this.ChangePasswordRequest.newPassword = this.changePasswordobject.newPassword;
      this._adminAuth.ChangePassword(this.ChangePasswordRequest).subscribe({
        next: (result:any) => {
          if(result.success){
            Swal.fire({
              title: "Success",
              text: "Password changed",
              icon: "success"
            });
            this.invalidMessage = '';
            changepasswordform.resetForm();
            localStorage.removeItem('token');
            this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
            this._tokenservice.ValidateToken();
          }
          else{
            this.invalidMessage = "You Entered Wrong Password!!";
          }
        },
        error: () => {
          this.invalidMessage = '';
          Swal.fire({
            title: "Failed",
            text: "Something went wrong. Password not changed",
            icon: "error"
          });
        }
      })
    }
   }
   GoToLogin(){
    this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000'])
  }
}
