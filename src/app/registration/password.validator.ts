import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export class AppValidators {
  static createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const errors = [];

      const hasUpperCase = /[A-Z]+/.test(value);
      if (!hasUpperCase) {
        errors.push('hasUpperCase');
      }
      const hasLowerCase = /[a-z]+/.test(value);

      if (!hasLowerCase) {
        errors.push('hasLowerCase');
      }

      const hasNumeric = /[0-9]+/.test(value);

      if (!hasNumeric) {
        errors.push('hasNumeric');
      }

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

      return !passwordValid ? { passwordStrength: errors } : null;
    };
  }
}
