import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export class EmailValidators {
  static EmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const errors = [];

      const emailIsCorrect = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
      if (!emailIsCorrect) {
        errors.push('Invalid email type!');
      }

      const emailValid = emailIsCorrect;

      return !emailValid ? { emailValid: errors } : null;
    };
  }
}
