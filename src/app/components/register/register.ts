import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
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
        id: 0,
        email,
        password,
        firstName,
        lastName,
        birthDate,
        role: 'CUSTOMER',
      };

      this.userService.create(body).subscribe({
        next: () => this.router.navigate(['login']),
        error: () => alert('Errore nella registrazione!'),
      });
    }
  }
}
