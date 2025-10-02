import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../auth/authService';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordFunctions } from '../../Utils/password-functions';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _snackBar = inject(MatSnackBar);
  loginForm: any;
  msg: string | undefined;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private login: UserService,
    private auth: AuthService,
    private router: Router,
    private PasswordFunctions: PasswordFunctions
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.login
        .signin({
          user: this.loginForm.value.email,
          pwd: this.PasswordFunctions.hashPassword(this.loginForm.value.password),
        })
        .subscribe((resp: any) => {
          console.log(resp);
          if (resp.logged) {
            // Salva il token nei cookie (esempio: valido per 1 giorno, path root)
            document.cookie = `token=${encodeURIComponent(
              resp.token
            )}; path=/; max-age=86400; SameSite=Strict`;
            localStorage.setItem('userId', resp.id);
            localStorage.setItem('token', resp.token);
            this.auth.setAuthentificated();
            this.msg = 'Login avvenuto con successo!';
            if (resp.role == 'ADMIN') {
              this.auth.setAdmin();
              window.location.href = '/home';
            }
            this._snackBar.open(this.msg, 'Chiudi', {
              duration: 3000,
            });

            this.router.navigate(['home']);
          } else {
            this.msg = 'User / Password invalido';
            this._snackBar.open(this.msg, 'Chiudi', {
              duration: 3000,
            });
          }
        });
      console.log('Dati del form:', this.loginForm.value);
    }
  }
}
