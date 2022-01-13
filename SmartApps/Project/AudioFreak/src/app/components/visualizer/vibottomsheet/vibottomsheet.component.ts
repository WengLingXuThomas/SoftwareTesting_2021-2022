import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';
import { UiService } from '../../../services/component/ui.service'

@Component({
  selector: 'app-vibottomsheet',
  templateUrl: './vibottomsheet.component.html',
  styleUrls: ['./vibottomsheet.component.css']
})
export class VibottomsheetComponent implements OnInit {

  currentVIType: string = "wave";

  viEnabled:boolean = false;
  viEnabledSubscription:Subscription;

  constructor(private _bottomSheetRef: MatBottomSheetRef<VibottomsheetComponent>, private uiService:UiService) {
    this.viEnabledSubscription = this.uiService.onToggleVisualizer().subscribe(bool => this.viEnabled = bool)
    this.viEnabled = this.uiService.toggleVis;
    this.currentVIType = this.uiService.vis2Show;
  }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  
  onVIToggle(){
    this.viEnabled = !this.viEnabled;
    this.uiService.toggleVisualizer(this.viEnabled);
  }

  onVisualizerTypeSelect(e: any){
    this.uiService.changeVis2Show(e.value);
  }

}
