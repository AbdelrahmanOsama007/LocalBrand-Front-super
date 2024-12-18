import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IChangepassword } from '../../../interfaces/IChangepassword';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordobject : IChangepassword = {oldPassword : '', newPassword: '', confirmNewPassword: ''}

  onSubmit(event : any , changepasswordform:NgForm){
    if(changepasswordform.invalid){
      event.stopPropagation();
      changepasswordform.control.markAllAsTouched();
    }
    else{
      console.log(changepasswordform.value);
    }
   }
}
