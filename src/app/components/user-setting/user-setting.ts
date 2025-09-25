import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { truncate } from 'fs';
@Component({
  selector: 'app-user-setting',
  standalone: false,
  templateUrl: './user-setting.html',
  styleUrl: './user-setting.css',
})
export class UserSetting {
  private _snackBar = inject(MatSnackBar);

  user = {
    name: 'Loading...',
    surname: 'Loading...',
    email: 'Loading...',
    birthdate: 'Loading...',
    currentPassword: '******************',
  };

  showPasswordEdit = false;
  showNewPassword = false;
  showConfirmPassword = false;
  showOldPassword = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        surname: ['', [Validators.required, Validators.minLength(3)]],
        email: [{ value: '', disabled: true }], // disabilitato
        currentPassword: [{ value: '************', disabled: true }], // disabilitato
        birthdate: ['', [Validators.required, birthDateRangeValidator]],
        newPassword: [''],
        confirmPassword: [''],
        oldPassword: [''],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.userService.getById(Number(userId)).subscribe((res) => {
          if (res && res.dati) {
            // console.log('User data:', res.dati);
            const utente = res.dati;
            this.user = {
              name: utente.firstName,
              surname: utente.lastName,
              email: utente.email,
              birthdate: utente.birthDate,
              currentPassword: '******************',
            };
            this.form.patchValue({
              name: this.user.name,
              surname: this.user.surname,
              birthdate: this.user.birthdate,
              email: this.user.email,
            });
          }
        });
      }
    }
  }

  newPassword = '';
  confirmPassword = '';
  oldPassword = '';

  togglePasswordEdit() {
    this.showPasswordEdit = !this.showPasswordEdit;
    const newPasswordControl = this.form.get('newPassword');
    const confirmPasswordControl = this.form.get('confirmPassword');
    const oldPasswordControl = this.form.get('oldPassword');
    // Aggiunge i validators se si abilita la modifica
    if (this.showPasswordEdit) {
      newPasswordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
      oldPasswordControl?.setValidators([Validators.required]);
    } else {
      newPasswordControl?.setValidators([Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([]);
      oldPasswordControl?.setValidators([]);
      this.newPassword = '';
      this.confirmPassword = '';
      this.oldPassword = '';
      this.form.patchValue({ newPassword: '', oldPassword: '' });
      this.showNewPassword = false;
      this.showConfirmPassword = false;
      this.showOldPassword = false;
    }
    // Aggiorna lo stato di validità dei controlli
    newPasswordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
    oldPasswordControl?.updateValueAndValidity();
  }

  cancelPasswordEdit() {
    this.showPasswordEdit = false;
    const newPasswordControl = this.form.get('newPassword');
    const confirmPasswordControl = this.form.get('confirmPassword');
    const oldPasswordControl = this.form.get('oldPassword');

    // Toglie i validators se si annulla la modifica
    newPasswordControl?.setValidators([Validators.minLength(6)]);
    confirmPasswordControl?.setValidators([]);
    oldPasswordControl?.setValidators([]);
    // Aggiorna lo stato di validità dei controlli
    newPasswordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
    oldPasswordControl?.updateValueAndValidity();
    this.newPassword = '';
    this.confirmPassword = '';
    this.oldPassword = '';
    this.form.patchValue({ newPassword: '', oldPassword: '' });
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.showOldPassword = false;
  }

  // Mostra o no la password
  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  toggleShowOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  onSubmit() {
    if (this.form.valid) {
      // Qui puoi gestire l'invio dei dati aggiornati dell'utente
      console.log('Form submitted:', this.form.getRawValue());
      let id = localStorage.getItem('userId');
      let email = null;
      let firstName = this.form.get('name')?.value;
      let lastName = this.form.get('surname')?.value;
      let birthDate = this.form.get('birthdate')?.value;
      let password = null;
      let passwordChanging = false;
      if (this.form.get('newPassword')?.value) {
        password = this.form.get('newPassword')?.value;
        passwordChanging = true;
      }
      if (firstName === this.user.name) {
        firstName = null;
      }
      if (lastName === this.user.surname) {
        lastName = null;
      }
      if (birthDate === this.user.birthdate) {
        birthDate = null;
      }
      const userNew = { id, email, firstName, lastName, birthDate, password };
      console.log(userNew);

      const userLogin = {
        user: this.user.email,
        pwd: this.form.get('oldPassword')?.value,
      };

      if (passwordChanging == true) {
        this.userService.signin(userLogin).subscribe((res) => {
          if (!res.logged) {
            this._snackBar.open('Password errata.', 'Chiudi', {
              duration: 3000,
            });
            return;
          } else {
            this.userService.update(userNew).subscribe(
              (res) => {
                this._snackBar.open('Utente aggiornato con successo!', 'Chiudi', {
                  duration: 3000,
                });
                this.ngOnInit();
                this.cancelPasswordEdit();
              },
              (error) => {
                this._snackBar.open('Errore nella modifica!', 'Chiudi', { duration: 3000 });
              }
            );
          }
        });
      } else {
        this.userService.update(userNew).subscribe(
          (res) => {
            this._snackBar.open('Utente aggiornato con successo!', 'Chiudi', { duration: 3000 });
            this.ngOnInit();
            this.cancelPasswordEdit();
          },
          (error) => {
            this._snackBar.open('Errore nella modifica!', 'Chiudi', { duration: 3000 });
          }
        );
      }
    } else {
      this._snackBar.open(
        'Errore nei dati inseriti, compila tutti i campi o controlla la password.',
        'Chiudi',
        {
          duration: 3000,
        }
      );
    }
  }
}

function passwordMatchValidator(group: FormGroup) {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

function birthDateRangeValidator(control: any) {
  if (!control.value) return null;
  const birthDate = new Date(control.value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();
  const realAge = m < 0 || (m === 0 && d < 0) ? age - 1 : age;
  if (realAge < 14 || realAge > 100) {
    return { birthDateRange: true };
  }
  return null;
}
