import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  header: string;
  text:string;
  closeBtnText:string;  
}

@Component({
  selector: 'app-basic-dialog2',
  templateUrl: './basic-dialog2.component.html',
  styleUrls: ['./basic-dialog2.component.css']
})
export class BasicDialog2Component implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}
