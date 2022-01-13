import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  header: string;
  text:string;
  closeBtnText:string;  
}

@Component({
  selector: 'app-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.css']
})
export class BasicDialogComponent { 
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

