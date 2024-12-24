import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IChangepassword } from '../../../interfaces/IChangepassword';
import { AdminAuthService } from '../../../services/admin-auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordobject : IChangepassword = {currentPassword : '', newPassword: '', confirmNewPassword: ''}
  constructor(private _adminAuth: AdminAuthService, private router: Router){}
  onSubmit(event : any , changepasswordform:NgForm){
    if(changepasswordform.invalid){
      event.stopPropagation();
      changepasswordform.control.markAllAsTouched();
    }
    else{
      this._adminAuth.ChangePassword(changepasswordform.value).subscribe({
        next: () => {
          Swal.fire({
            title: "Success",
            text: "Password changed",
            icon: "success"
          });
        },
        error: () => {
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
