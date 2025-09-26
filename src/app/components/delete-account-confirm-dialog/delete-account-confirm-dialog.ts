import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'delete-account-confirm-dialog',
  templateUrl: './delete-account-confirm-dialog.html',
  standalone: false,
  styleUrls: ['./delete-account-confirm-dialog.css'],
})
export class DeleteAccountConfirmDialog {
  constructor(private dialogRef: MatDialogRef<DeleteAccountConfirmDialog>) {}

  confirm() {
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
