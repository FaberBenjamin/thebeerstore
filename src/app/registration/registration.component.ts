import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { AppValidators } from './password.validator';
import { Router } from '@angular/router';
import { EmailValidators } from './email.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  customErrors: Array<string> = [];

  passwordIsRequired: boolean;
  usernameIsRequired: boolean;
  emailIsRequired: boolean;
  cityIsRequired: boolean;
  fullnameIsRequired: boolean;
  adressIsRequired: boolean;
  postCodeIsRequired: boolean;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  registrationForm = new FormGroup({
    username: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required, EmailValidators.EmailValidator()] }),
    password: new FormControl('', {
      validators: [Validators.required, AppValidators.createPasswordStrengthValidator()],
    }),
    fullName: new FormControl('', { validators: [Validators.required] }),
    city: new FormControl('', { validators: [Validators.required] }),
    postcode: new FormControl('', { validators: [Validators.required] }),
    adress: new FormControl('', { validators: [Validators.required] }),
  });

  onSubmit() {
    this.customErrors = [];

    this.registrationForm.controls.password?.errors?.['required']
      ? (this.passwordIsRequired = true)
      : (this.passwordIsRequired = false);
    this.registrationForm.controls.email?.errors?.['required']
      ? (this.emailIsRequired = true)
      : (this.emailIsRequired = false);
    this.registrationForm.controls.username?.errors?.['required']
      ? (this.usernameIsRequired = true)
      : (this.usernameIsRequired = false);
    this.registrationForm.controls.city?.errors?.['required']
      ? (this.cityIsRequired = true)
      : (this.cityIsRequired = false);
    this.registrationForm.controls.fullName?.errors?.['required']
      ? (this.fullnameIsRequired = true)
      : (this.fullnameIsRequired = false);
    this.registrationForm.controls.postcode?.errors?.['required']
      ? (this.postCodeIsRequired = true)
      : (this.postCodeIsRequired = false);
    this.registrationForm.controls.adress?.errors?.['required']
      ? (this.adressIsRequired = true)
      : (this.adressIsRequired = false);
    this.registrationForm.controls.email?.errors?.['emailValid']
      ? (this.emailIsRequired = true)
      : (this.emailIsRequired = false);

    if (this.registrationForm.controls.password?.errors?.['passwordStrength']) {
      this.passwordIsRequired = false;
      this.registrationForm.controls.password?.errors!['passwordStrength'].includes('hasUpperCase')
        ? this.customErrors.push('uppercase letter')
        : null;
      this.registrationForm.controls.password?.errors!['passwordStrength'].includes('hasLowerCase')
        ? this.customErrors.push('lowercase letter')
        : null;
      this.registrationForm.controls.password?.errors!['passwordStrength'].includes('hasNumeric')
        ? this.customErrors.push('number')
        : null;
    } else if (this.registrationForm.valid) {
      this.authService
        .registration(
          this.registrationForm.controls.username.value!,
          this.registrationForm.controls.email.value!,
          this.registrationForm.controls.password.value!,
          this.registrationForm.controls.fullName.value!,
          this.registrationForm.controls.city.value!,
          this.registrationForm.controls.postcode.value!,
          this.registrationForm.controls.adress.value!
        )
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
  }
}
