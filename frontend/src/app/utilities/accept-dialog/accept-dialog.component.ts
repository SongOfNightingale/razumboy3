import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-accept-dialog',
  templateUrl: './accept-dialog.component.html',
  styleUrl: './accept-dialog.component.css'
})
export class AcceptDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AcceptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onOkClick(): void {
    this.dialogRef.close(true);
  }
}
