import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  passwordIsRequired: boolean;
  emailIsRequired: boolean;
  errorMessage: string;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  loginForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
  });

  onSubmit() {
    this.loginForm.controls.password?.errors?.['required'] ? (this.passwordIsRequired = true) : false;
    this.loginForm.controls.email?.errors?.['required'] ? (this.emailIsRequired = true) : false;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.controls.email.value!, this.loginForm.controls.password.value!).subscribe(
        (res) => {
          this.authService.handleLogin(res.token);
          this.router.navigate(['/']);
        },
        (error) => {
          this.errorMessage = error.error.errorMessage;
        }
      );
    }
  }
}
