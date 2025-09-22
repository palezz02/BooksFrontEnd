import { Component } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../auth/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: any;
  msg: string | undefined;
  constructor(private fb: FormBuilder, private login:UserService, private auth:AuthService, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {

    if (this.loginForm.valid) {
      this.login.signin({
        user: this.loginForm.value.email,
        pwd: this.loginForm.value.password
      }).subscribe((resp: any) => {
      console.log(resp);
      if (resp.logged) {
        console.log('utente logged.. role:' + resp.role);
        this.auth.setAuthentificated();
        this.msg="";
        if (resp.role == 'ADMIN') {
          this.auth.setAdmin();
        }
        this.router.navigate(['books']);
      } else {
        this.msg='user/password invalido';
      }
    })
      console.log('Dati del form:', this.loginForm.value);
    }
  }
}
