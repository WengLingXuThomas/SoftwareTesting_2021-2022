import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-eqbottomsheet',
  templateUrl: './eqbottomsheet.component.html',
  styleUrls: ['./eqbottomsheet.component.css']
})
export class EQBottomsheetComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<EQBottomsheetComponent>) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
