import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-user-setting',
  standalone: false,
  templateUrl: './user-setting.html',
  styleUrl: './user-setting.css',
})
export class UserSetting {
  user = {
    name: 'test',
    surname: 'asd',
    email: 'test@gmail.com',
    birthdate: '2005-11-02',
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
        newPassword: ['', [Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
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
    if (!this.showPasswordEdit) {
      this.newPassword = '';
      this.confirmPassword = '';
      this.oldPassword = '';
      this.form.patchValue({ newPassword: '', oldPassword: '' });
      this.showNewPassword = false;
      this.showConfirmPassword = false;
      this.showOldPassword = false;
    }
  }

  cancelPasswordEdit() {
    this.showPasswordEdit = false;
    this.newPassword = '';
    this.confirmPassword = '';
    this.oldPassword = '';
    this.form.patchValue({ newPassword: '', oldPassword: '' });
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.showOldPassword = false;
  }
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
      // Esempio: this.userService.update(this.form.getRawValue()).subscribe(...)
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
