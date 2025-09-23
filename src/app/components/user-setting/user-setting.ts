import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

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
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: [this.user.name, [Validators.required, Validators.minLength(3)]],
        surname: [this.user.surname, [Validators.required, Validators.minLength(3)]],
        birthdate: [this.user.birthdate, [Validators.required, birthDateRangeValidator]],
        newPassword: ['', [Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        oldPassword: [''],
      },
      { validators: passwordMatchValidator }
    );
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
    }
  }

  cancelPasswordEdit() {
    this.showPasswordEdit = false;
    this.newPassword = '';
    this.confirmPassword = '';
    this.oldPassword = '';
    this.form.patchValue({ newPassword: '', oldPassword: '' });
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
