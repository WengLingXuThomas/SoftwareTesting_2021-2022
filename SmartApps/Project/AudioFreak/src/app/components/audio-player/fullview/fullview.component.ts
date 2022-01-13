import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from '../../../services/component/ui.service'
import { AudioService } from '../../../services/component/audio.service'
import {LyricsService} from '../../../services/API/lyrics.service'
import {DomSanitizer } from '@angular/platform-browser'
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { VibottomsheetComponent } from '../../visualizer/vibottomsheet/vibottomsheet.component'
import { EQBottomsheetComponent } from '../../equalizer/eqbottomsheet/eqbottomsheet.component'
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-fullview',
  templateUrl: './fullview.component.html',
  styleUrls: ['./fullview.component.css']
})
export class FullviewComponent implements OnInit, AfterViewInit {

  @ViewChild('mainWrapper') mainContainer:ElementRef;
  @ViewChild('mattabgroup') tabs:MatTabGroup;
  isActive: boolean = false;
  subscriptionFV: Subscription;

  songData:any = {title: '', artist: '', cover: '', duration: '00:00', maxTime: 100};
  songDataSubcription:Subscription;

  currentTime: string = "00:00";
  currentTimeSubscription: Subscription;

  duration:any = this.songData.duration;
  minTime:number = 0;
  maxTime:number = this.songData.maxTime;

  timeSliderVal:any = 0;
  timeSliderValSubscription:Subscription;

  isPlaying: boolean = false;
  isPlayingSubscription: Subscription;

  resetPlayerSubscription: Subscription;

  showVisual:boolean = false;

  toggleVisSubscription: Subscription;

  toggleReadability:boolean = false;
  lyricPresent:boolean = false;


  constructor(private uiService:UiService, private audioService:AudioService, private lyricsService:LyricsService,  public domSrv: DomSanitizer, private _bottomSheet: MatBottomSheet) {
    this.subscriptionFV = this.uiService.onToggleFullView().subscribe(state => {
      this.isActive = state;

      if (this.isActive == true) {
        this.tabs.realignInkBar();
        if(this.tabs.selectedIndex == 1){
          this.lyricsService.invokeFetchLyrics();
        }
      }

    })
    this.songDataSubcription = this.audioService.onChangeSongMetaData().subscribe(data => {
      if (data.cover != undefined) {
        if (data.cover == "") {
          this.songData.cover = "../../../../assets/images/no_cover_dark.png";
        }else{
          this.songData.cover = data.cover;
        }
      }
        
      this.songData.title = data.title;
      this.songData.artist = data.artist;
      this.duration = data.duration;
      this.maxTime = data.maxTime;
      this.isPlaying = data.isPlaying;
      console.log(this.songData);
    })
    this.currentTimeSubscription = this.audioService.onChangeCurrentTimeSong().subscribe(time => this.currentTime = time);
    this.timeSliderValSubscription = this.audioService.onChangeTimeSliderValue().subscribe(value => this.timeSliderVal = value);
    this.isPlayingSubscription = this.audioService.onChangeStateIsPlaying().subscribe(state => this.isPlaying = state);
    this.resetPlayerSubscription = this.audioService.onInvokeResetPlayer().subscribe((bool => this.resetPlayer(bool)));
    this.toggleVisSubscription = this.uiService.onToggleVisualizer().subscribe((bool => {
      this.showVisual = bool
      //TO DO: unrender p5 canvas when away from Full view
    }));

    this.lyricsService.onChangelyricPresent().subscribe(isPresent => this.lyricPresent = isPresent);
    this.audioService.onChangeShuffleOn().subscribe(isOn => {
      this.shuffleOn = isOn;
    })

    this.audioService.onChangeRepeatOn().subscribe(isOn => {
      this.repeatOn = isOn;
    })

    this.audioService.onChangeIsMuted().subscribe(muted => {
      this.isMuted = muted;
    })

    this.audioService.onChangeVolume().subscribe(level => {
      this.volume = level;
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
 
  }

  minimizeView(){
    this.uiService.toggleFullView(false);
  }

  togglePrevious(){
    this.audioService.invokeTogglePrevious();
  }

  togglePlay(){
    this.audioService.invokeTogglePlay();
  }

  toggleNext(){
    this.audioService.invokeToggleNext();
  }

  changeCurTime(value:any){
    this.audioService.invokeChangeCurTime(value);
  }

  resetPlayer(isPlaying:boolean){
    this.isPlaying = isPlaying;
    this.timeSliderVal = 0;
    this.currentTime = "00:00";
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    if (this.showVisual == true) {
      this.uiService.setVisCanvasPrefDims(this.mainContainer.nativeElement.offsetWidth,this.mainContainer.nativeElement.offsetHeight);
    }
  }

  openVIBottomsheet(){
    this.uiService.setVisCanvasPrefDims(this.mainContainer.nativeElement.offsetWidth,this.mainContainer.nativeElement.offsetHeight);
    this._bottomSheet.open(VibottomsheetComponent);
  }

  openEQBottomSheet(): void {
    this._bottomSheet.open(EQBottomsheetComponent);
  }

  tabChange(e:MatTabChangeEvent){
    if (e.index == 1) {
      this.lyricsService.invokeFetchLyrics();
    }
  }

  editLyric(){
    alert("not implemented yet")
  }

  async deleteLyric(){
    let deleteCallBack = await this.lyricsService.deleteLyric(this.songData.title.trim().toLowerCase(),this.songData.artist.trim().toLowerCase());
    if (deleteCallBack.res == true) {
      await this.lyricsService.invokeClearLyric();
    }
  }

  improveReadability(){ 
   this.toggleReadability = !this.toggleReadability;
  }


  shuffleOn:boolean = false;

  toggleShuffle(){
    this.audioService.invokeToggleShuffle();
  }

  repeatOn:boolean = false;

  toggleRepeat(){ 
    this.audioService.invokeToggleRepeat();
  }

  isMuted:boolean = false;
  volume:number = 100;
  onMute(){
    this.audioService.invokeOnMute();
  }

  adjustVolume(e:any){
    this.audioService.invokeAdjustVolume(e);
  }

}
