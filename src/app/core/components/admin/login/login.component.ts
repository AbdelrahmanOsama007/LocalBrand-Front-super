import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ILogin } from '../../../interfaces/ILogIn';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginobject: ILogin = {email: '', password: ''}
  invalidMessage: string = '';
  constructor(private router: Router, private _adminAuth: AdminAuthService){}
  handlePasswordInput() {
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const togglePassword = document.getElementById('togglePassword') as HTMLElement | null;
  
    if (passwordInput && togglePassword) {
      togglePassword.style.display = passwordInput.value ? 'inline' : 'none';
    }
  }
  
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const togglePassword = document.getElementById('togglePassword') as HTMLElement | null;
  
    if (passwordInput && togglePassword) {
      const isPasswordVisible = passwordInput.type === 'password';
      passwordInput.type = isPasswordVisible ? 'text' : 'password';
      togglePassword.textContent = isPasswordVisible ? '🙈' : '👁️';
    }
  }

  GoTOForgetPassword(){
    this.router.navigate(['/forget-password']);
  }

  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/home' } });
  }

  onSubmit(event : any , loginform:NgForm){
    if(loginform.invalid){
      event.stopPropagation();
      loginform.control.markAllAsTouched();
    }
    else{
      this._adminAuth.Login(loginform.value).subscribe({
        next:(result) => {
          if(result.token){
            this.invalidMessage = '';
            const token = (localStorage.setItem("token", result.token));
            this.router.navigate(['admin/home']);
          }
        },
        error: (error) => {
          if(error.status == 401){
            this.invalidMessage = "invalid name or password";
          }
          else{
            this.invalidMessage = '';
            this.GoToError();
          }
        }
      })
    }
   }
}
