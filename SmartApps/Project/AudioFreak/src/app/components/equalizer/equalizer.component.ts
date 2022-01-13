import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioService } from "../../services/component/audio.service"
import { loadExternalJSON } from "../../../assets/libs/loadJSON";
import { MatSlider } from '@angular/material/slider';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.css']
})
export class EqualizerComponent implements OnInit, AfterViewInit {

  @ViewChildren('slider') sliders:QueryList<MatSlider>;
  @ViewChild('power') enableToggle:ElementRef;
  @ViewChild('select') select:MatSelect;


  sliderIDs:any[] = [
    's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7'
  ]

  eqEnabled:boolean;
  eqEnabledSubscription:Subscription;

  eqFilters:any;
  eqFiltersSubscription:Subscription;

  disableSave:boolean = true;

  formatLabel(value: number) {
    return value + 'db';
  }

  constructor(private _audioService: AudioService) { 
    this.eqEnabledSubscription = this._audioService.onStateEqEnabledChanged().subscribe((state => {
      this.eqEnabled = state;
    }));
    this.eqFiltersSubscription = this._audioService.onFiltersChanged().subscribe((filters => {
      this.eqFilters = filters;
      this.main();
    }));
  }

  async ngOnInit(): Promise<void> {
    this.eqEnabled = this._audioService.eqEnabled;
    this.eqFilters = this._audioService.filters;
  }

  async ngAfterViewInit(): Promise<void> {
    await this.main();
  }

  async main(){
    for (let sliderID in this.eqFilters) {
      this.setSliderValue(sliderID, this.eqFilters[sliderID].gain)
    }
  }

  setSliderValue(sliderID:any, value:any) {
    let sldrEl = this.sliders.toArray().find(Slider => Slider._elementRef.nativeElement.id == sliderID)
    sldrEl.value = value;
  }

  onEQToggle(){
    this._audioService.invokeOnEQToggle();
  }

  onSliderValueChange(e:any){
    this.select.value = "manual";
    this.disableSave = false;

    var sliderId = e.source._elementRef.nativeElement.id;
    var sliderValue = e.value;
    this.sendFreqSpecificGainMessage(sliderId, sliderValue) 
  }

  sendFreqSpecificGainMessage(sliderNumber:any, gainValue:any) {
    this._audioService.invokeOnSliderGain({slider_index: sliderNumber, value: gainValue});
  }

  onPresetSelect(e:any){

    if (e.value == "manual") {
      this.disableSave = false;
    }else{
      this.disableSave = true;
      this._audioService.invokeOnPresetSelect({preset: e.value});

      loadExternalJSON('../../../assets/presets.json', (presets:any) => {
        for (let [sliderName, value] of Object.entries(presets[e.value])) {
          this.setSliderValue(sliderName, value);
        }
      }, (e:any) => {
        console.error(e)
      })
    }
  }

  reset() {
    this.select.value = "flat";
    this.disableSave = true;
    for (var i = 0; i < this.sliderIDs.length; i++) {
      this.sendFreqSpecificGainMessage(this.sliderIDs[i], 0);
      this.setSliderValue(this.sliderIDs[i],0)
    }
  }

  savePreset() {
    alert('Function not yet implemented.');
  }
}


