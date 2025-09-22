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

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
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
