import { Component, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseBase } from '../../models/ResponseBase';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private _snackBar = inject(MatSnackBar);

  loginForm: any;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', [Validators.required, birthDateRangeValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, firstName, lastName, birthDate, password, confirmPassword } =
        this.loginForm.value;

      if (password !== confirmPassword) {
        alert('Le password non coincidono!');
        return;
      }

      const body = {
        email,
        password,
        firstName,
        lastName,
        birthDate,
        role: 'CUSTOMER',
      };

      this.userService.create(body).subscribe({
        next: (res: ResponseBase) => {
          if (res.rc) {
            this.router.navigate(['login']);
            this._snackBar.open('Registrazione avvenuta con successo!', 'Chiudi', {
              duration: 3000,
            });
          } else {
            this._snackBar.open(res.msg || 'Errore nella registrazione!', 'Chiudi', {
              duration: 3000,
            });
          }
        },
        error: (err) => {
          console.error('Errore durante la registrazione:', err);
          this._snackBar.open('Errore nella registrazione!', 'Chiudi', { duration: 3000 });
        },
      });
    }
  }
}

function birthDateRangeValidator(control: any) {
  if (!control.value) return null;
  const birthDate = new Date(control.value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();
  // Adjust age if birthday hasn't occurred yet this year
  const realAge = m < 0 || (m === 0 && d < 0) ? age - 1 : age;
  if (realAge < 14 || realAge > 100) {
    return { birthDateRange: true };
  }
  return null;
}
