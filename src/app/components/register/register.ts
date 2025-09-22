import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  loginForm: any;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const userName = this.loginForm.value.userName;
      const password = this.loginForm.value.password;
      const confirmPassword = this.loginForm.value.confirmPassword;

      if (password !== confirmPassword) {
        alert('Le password non coincidono!');
        return;
      }

      const body = {
        email: email,
        userName: userName,
        password: password,
      };

      this.userService.create(body).subscribe({
        next: () => alert('Registrazione avvenuta con successo!'),
        error: () => alert('Errore nella registrazione!'),
      });
    }
  }
}
