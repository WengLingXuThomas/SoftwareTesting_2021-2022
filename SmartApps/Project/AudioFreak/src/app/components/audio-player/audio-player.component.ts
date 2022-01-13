import { AfterViewInit, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/component/audio.service';
import { loadExternalJSON } from "../../../assets/libs/loadJSON";
import { DirectoryService } from '../../services/FileSystem/directory.service';
import { DexieService } from '../../services/indexdDB/dexie.service';
import { UiService } from '../../services/component/ui.service'
import { BreakpointObserver } from '@angular/cdk/layout'
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class AudioPlayerComponent implements OnInit,AfterViewInit {

  @ViewChild('audio') audio:ElementRef;
  @ViewChild('miniCover1') cover1:ElementRef;
  @ViewChild('miniCover2') cover2:ElementRef;
  @ViewChild('seekslider') seekslider:ElementRef;

  @ViewChild('currentSongEl') currentSongEl:ElementRef;
  @ViewChild('currentArtistEl') currentArtistEl:ElementRef;
  @ViewChild('currentSongElmin') currentSongElmin:ElementRef;
  @ViewChild('currentArtistElmin') currentArtistElmin:ElementRef;

  songToPlay: any = null;
  subscription: Subscription;

  isPlaying: boolean = false;
  currentSong: string;
  currentArtist: string;
  coverURL:any;
  currentTime: string = "00:00";
  duration:any = "00:00";
  timeSliderVal:any = 0;
  minTime:number = 0;
  maxTime:number = 100;
  isMuted:boolean = false;
  disableControls: boolean = true;
  volume:number = 100;
  
  showMinimalAudioControl:boolean = false;

  fullView:boolean = false;
  FVsubscription: Subscription;

  invokeChangeCurTimeSubscription: Subscription;
  invokeTogglePlaySubscription: Subscription;

  mainAudioMediaSrcSubscription:Subscription;

  themeColor:string = "#3f51b5";
  themeColorSubscription:Subscription;

  constructor(public audioService:AudioService, private dexie: DexieService, private directoryService:DirectoryService ,private uiService:UiService,private breakpointObserver:BreakpointObserver) {
    
    this.subscription = this.audioService.onChangeSong().subscribe((value => {
      this.songToPlay = value;
      this.playAudioFile(this.songToPlay);
    }))
    
    this.themeColorSubscription = this.uiService.onThemeColorChange().subscribe(theme => {
      this.themeColor = theme.headingColor;
    })
    
    /* #region EQ */
    this.EQEnabledSubscription = this.audioService.onStateEqEnabledChanged().subscribe((state => this.EQEnabled = state))
    this.filtersSubscription = this.audioService.onFiltersChanged().subscribe((filters => this.filters = filters))
    this.onSliderGainInvokeSubscription = this.audioService.onSliderGain().subscribe((params => {
      this.changeEQGain(params.slider_index,params.value)
    }))
    this.onPresetSelectInvokeSubscription = this.audioService.onPresetSelect().subscribe((params => {
      this.selectPreset(params.preset)
    }))
    this.onPowerOnInvokeSubscription = this.audioService.onEQToggle().subscribe((() => {
        this.eqToggle();
    }))

    this.audioService.changeStateEqEnabled(false);
    /* #endregion */

    this.FVsubscription = this.uiService.onToggleFullView().subscribe(toggleBool => {
      if(toggleBool){
        this.audioService.changeSongMetaData({title: this.currentSong, artist: this.currentArtist, cover:this.coverURL, duration: this.duration, maxTime: this.maxTime, isPlaying:this.isPlaying});
        this.audioService.updateAudioEl(this.audio);
      }  
    });

    this.invokeChangeCurTimeSubscription = this.audioService.onInvokeChangeCurTime().subscribe(value => this.changeCurTime(value));

    this.audioService.onInvokeTogglePrevious().subscribe(() => {
      this.previousTrack()
    });

    this.invokeTogglePlaySubscription = this.audioService.onInvokeTogglePlay().subscribe(() => this.togglePlay());

    this.audioService.onInvokeToggleNext().subscribe(() => {
      this.nextTrack()
    });

    this.audioService.onInvokeShuffleQueue().subscribe(() => this.shuffleQueueOrder());

    this.audioService.onInvokeToggleShuffle().subscribe(() => this.toggleShuffle());

    this.audioService.onInvokeToggleRepeat().subscribe(() => this.toggleRepeat());

    this.audioService.onInvokeOnMute().subscribe(() => this.onMute());

    this.audioService.onInvokeAdjustVolume().subscribe((e) => {
      this.adjustVolume(e);
      this.volume = e.value;
    });

   /* #region P5 audio source  */
    this.mainAudioMediaSrcSubscription = this.audioService.onUpdateMainAudioSource().subscribe((data:any) => {
      this.initMediaSrcWithFilters(data);
    })
   /* #endregion */
  }

  async ngOnInit(): Promise<void> {

    await this.initMediaSessionAPI();

    /* #region  Init Volume */
    let volResp = await this.dexie.getSetting("volume")
    this.volume = volResp != null ? volResp * 100 : 100

    this.audio.nativeElement.volume = this.volume / 100;
    await this.audioService.changeVolume(this.volume);
    /* #endregion */

    /* #region  EQ */
    await loadExternalJSON('../../../assets/filters.json',
    (filtersObject:any) => {
      this.audioService.changeFilters(filtersObject);
      //this.filters = filtersObject
      this.init()
    },(e:any) => {
      console.error('Error loading filters.json. Setting to hard-coded default')
      this.filters = {
          "s0": {
              "type": "lowshelf",
              "frequency": 100,
              "gain": 0,
              "filter": undefined
          },
          "s1": {
              "type": "peaking",
              "frequency": 250,
              "gain": 0,
              "Q": 1.0,
              "filter": undefined
          },
          "s2": {
              "type": "peaking",
              "frequency": 500,
              "gain": 0,
              "Q": 1.0,
              "filter": undefined
          },
          "s3": {
              "type": "peaking",
              "frequency": 1000,
              "gain": 0,
              "Q": 1.0,
              "filter": undefined
          },
          "s4": {
              "type": "peaking",
              "frequency": 2000,
              "gain": 0,
              "Q": 1.0,
              "filter": undefined
          },
          "s5": {
              "type": "peaking",
              "frequency": 5000,
              "gain": 0,
              "Q": 1.0,
              "filter": undefined
          },
          "s6": {
              "type": "peaking",
              "frequency": 10000,
              "gain": 0,
              "Q": 1.0,
              "filter": undefined
          },
          "s7": {
              "type": "highshelf",
              "frequency": 12000,
              "gain": 0,
              "filter": undefined
          },
      }
        this.init()
      }
    )
    /* #endregion */
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.breakpointObserver.observe(['(max-width:749px)']).subscribe((res) => {
        if (res.matches) {
          this.showMinimalAudioControl = true;
          if (this.coverURL) {
            this.cover2.nativeElement.src = this.coverURL;
          }
        }else{
          this.showMinimalAudioControl = false;
          if (this.coverURL) {
            this.cover1.nativeElement.src = this.coverURL;
          }
        }
      })
    }, 0);
  }
                                  
  //Wordt uitgevoerd wanneer er een liedje wordt aangeklikt
  async playAudioFile(fileData:any){
    try {

      if(this.directoryService.dirPermissionGranted == false){
        await this.directoryService.requestPermission();
      }

      this.resetPlayer(true);
     
      this.updateSongUI(fileData.fileMeta.title,fileData.fileMeta.artist,fileData.fileMeta.CoverID);
      const track = await fileData.fileHandle.getFile();
      const url = URL.createObjectURL(track);

      this.audio.nativeElement.src = url;
      this.audio.nativeElement.play();
      this.isPlaying = true;

      this.toggleMarquee();

    } catch (error:any) {
      console.log(`%c ${error} `, 'background: #222; color: red');
      if (error.name == "NotAllowedError") {
        await this.directoryService.requestPermission();
      }
    }
  }

  //update ui info over huidige track
  async updateSongUI(title:string,artist:string, coverID:any, ){
    this.currentSong = title;
    this.currentArtist = artist;

    //indien cover img aan audio file gelinkt, deze dynamisch prefetchen in indexedDB via DexieService
    if (coverID != null) {
/*       const { data, format } = (await this.dexie.getCover(coverID)).coverData;
    
      //image data omzetten om te kunnen weergeven in de UI
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }

      this.coverURL = `data:${data.format};base64,${window.btoa(base64String)}`; */

      const imgBlob = (await this.dexie.getCover(coverID)).coverData;
      const url = URL.createObjectURL(imgBlob);
      this.coverURL = url;

      await this.setMediaSessionData(this.currentSong, this.currentArtist, this.coverURL);

      if (this.showMinimalAudioControl) {
        this.cover2.nativeElement.src = this.coverURL;
      } else {
        this.cover1.nativeElement.src = this.coverURL;
      }
      
    }else{

      await this.setMediaSessionData(this.currentSong, this.currentArtist, "../../../assets/images/no_album_art.jpg");

      if (this.showMinimalAudioControl) {
        this.cover2.nativeElement.src = "../../../assets/images/no_album_art.jpg";
      } else {
        this.cover1.nativeElement.src = "../../../assets/images/no_album_art.jpg";
      }
      this.coverURL = "";
    }


  }

  //om/off switch voor audio playback
  togglePlay(){
    if (this.isPlaying) {
      this.audio.nativeElement.pause();
      this.isPlaying = false;
    }else{
      this.audio.nativeElement.play();
      this.isPlaying = true;
    }
    this.toggleMarquee();
    this.audioService.changeStateIsPlaying(this.isPlaying);
  }

  //wordt getriggerd elke seconde waneer audio aan het spelen is.
  onPlaying(e:any){
    //huidige tijd continu updaten samen met progress van slider.
    this.currentTime = this.sToTime(e.target.currentTime);
    this.audioService.changeCurrentTimeSong(this.currentTime);

    //let passedSec = Math.floor((e.target.currentTime / this.audio.nativeElement.duration) * 100);

    let passedSec = Math.floor(e.target.currentTime);
    if(this.timeSliderVal < passedSec){
      this.timeSliderVal = passedSec;
      this.audioService.changeTimeSliderValue(this.timeSliderVal);
    }
  }
  
  //methode om het volume mee te regelen
  async adjustVolume(e:any){
    if (this.isMuted == true) {
      this.audio.nativeElement.muted = false;
      this.isMuted = false;
    }
    
    this.audio.nativeElement.volume = e.value / 100;
    await this.audioService.changeVolume(e.value);
    await this.dexie.saveSetting("volume", this.audio.nativeElement.volume);
  }

  //mute button event handler
  async onMute(){
    if (this.isMuted == false) {
      this.audio.nativeElement.muted = true;
      this.isMuted = true;
    }else{
      this.audio.nativeElement.muted = false;
      this.isMuted = false;
    }
    await this.audioService.changeIsMuted(this.isMuted);
  }

  //deze methode wordt uitgevoerd wanneer het "loadedmetadata" event word getriggerd door audio element 
  getMetaFromInput(e:any){
    //de totale duratie van het huidig liedje achterhalen en weergeven.
    this.duration = this.calcDuration(parseInt(e.target.duration))
    this.maxTime = Math.floor(e.target.duration);
  }

  // wordt getriggerd wanneer audio kan afgespeeld worden
  onCanplay(){
    //enable controls indien audio beschikbaar
    if (this.audio.nativeElement.readyState > 2) {
      this.disableControls = false;
    }
  }

  //wordt opegeroepen wanneer de value van de tijd slider verandert om de huidige tijd te veranderen.
  changeCurTime(value:any){
    //this.audio.nativeElement.currentTime = this.audio.nativeElement.duration * (value/100);
    this.audio.nativeElement.currentTime = value;

    //audio hernemen indien gepauzeerd.
    if (this.audio.nativeElement.paused) {
      this.isPlaying = true;
      this.audio.nativeElement.play();
    }
  }

  //event wordt opgeroepen wanneer audio gedaan is met spelen.
  async onTrackEnded(e:any){
    this.resetPlayer(false);
    if (this.repeatOn == true) {
      await this.togglePlay();
    } else if (this.repeatOn == false) {
      await this.nextTrack();
    }
  }

  resetPlayer(isPlaying:boolean){
    this.audioService.invokeResetPlayer(isPlaying);
    this.isPlaying = isPlaying;
    this.timeSliderVal = 0;
    this.currentTime = "00:00";
  }

  toggleMarquee(){

  if(this.showMinimalAudioControl == false){
    this.currentSongEl.nativeElement.classList.remove('marquee2');
    this.currentArtistEl.nativeElement.classList.remove('marquee2');

    if (this.isPlaying) {
      if (this.isOverflown(this.currentSongEl)) {
        this.currentSongEl.nativeElement.classList.add('marquee2');
      }
  
      if (this.isOverflown(this.currentArtistEl)) {
        this.currentArtistEl.nativeElement.classList.add('marquee2');
      }
    }
  }else{
    this.currentSongElmin.nativeElement.classList.remove('marquee2');
    this.currentArtistElmin.nativeElement.classList.remove('marquee2');

    if (this.isPlaying) {
      if (this.isOverflown(this.currentSongElmin)) {
        this.currentSongElmin.nativeElement.classList.add('marquee2');
      }
  
      if (this.isOverflown(this.currentArtistElmin)) {
        this.currentArtistElmin.nativeElement.classList.add('marquee2');
      }
    }
  }






  }

  toggleFullView(){
    this.uiService.toggleFullView(true);
  }

/* #region  P5 */

  initMediaSrcWithFilters(data:any){
    //prevent audio from pausing when enabling eq before p5 canvas audioContext
    data.P5Ref.userStartAudio();
    this.setFilter(data.mediaSrc,data.P5Ref.soundOut, data.Ctx);
  }

/* #endregion */

/* #region  EQ related */

  audioContext:any;
  inputStream:any;

  filters:any;
  filtersSubscription:Subscription;

  EQEnabled:boolean = false;
  EQEnabledSubscription: Subscription;

  onSliderGainInvokeSubscription:Subscription;
  onPresetSelectInvokeSubscription:Subscription;
  onPowerOnInvokeSubscription:Subscription;

  setFilter(src:any, audioNodeDestination:any, ctx:any){
    this.inputStream = src;
    this.audioContext = ctx;
    for (var filterID in this.filters) {
      this.filters[filterID].filter = this.audioContext.createBiquadFilter();
      this.filters[filterID].filter.type = this.filters[filterID].type;
      this.filters[filterID].filter.frequency.setValueAtTime(this.filters[filterID].frequency, this.audioContext.currentTime);
      this.filters[filterID].filter.gain.setValueAtTime(this.filters[filterID].gain, this.audioContext.currentTime);
    }
    src.connect(this.filters['s0'].filter);
    this.filters['s0'].filter.connect(this.filters['s1'].filter);
    this.filters['s1'].filter.connect(this.filters['s2'].filter);
    this.filters['s2'].filter.connect(this.filters['s3'].filter);
    this.filters['s3'].filter.connect(this.filters['s4'].filter);
    this.filters['s4'].filter.connect(this.filters['s5'].filter);
    this.filters['s5'].filter.connect(this.filters['s6'].filter);
    this.filters['s6'].filter.connect(this.filters['s7'].filter);
    this.filters['s7'].filter.connect(audioNodeDestination);
  }

  async init() {
    if (this.EQEnabled == true) {
      //this.audioContext = new AudioContext();
      //this.inputStream = this.audioContext.createMediaElementSource(this.audio.nativeElement);
    /*   
      for (var filterID in this.filters) {
          this.filters[filterID].filter = this.audioContext.createBiquadFilter();
          this.filters[filterID].filter.type = this.filters[filterID].type;
          this.filters[filterID].filter.frequency.setValueAtTime(this.filters[filterID].frequency, this.audioContext.currentTime);
          this.filters[filterID].filter.gain.setValueAtTime(this.filters[filterID].gain, this.audioContext.currentTime);
      } */
  
 /*      this.inputStream.connect(this.filters['s0'].filter)
      .connect(this.filters['s1'].filter)
      .connect(this.filters['s2'].filter)
      .connect(this.filters['s3'].filter)
      .connect(this.filters['s4'].filter)
      .connect(this.filters['s5'].filter)
      .connect(this.filters['s6'].filter)
      .connect(this.filters['s7'].filter)
      .connect(this.audioContext.destination) */

/*       this.inputStream.connect(this.filters['s0'].filter);
      this.filters['s0'].filter.connect(this.filters['s1'].filter);
      this.filters['s1'].filter.connect(this.filters['s2'].filter);
      this.filters['s2'].filter.connect(this.filters['s3'].filter);
      this.filters['s3'].filter.connect(this.filters['s4'].filter);
      this.filters['s4'].filter.connect(this.filters['s5'].filter);
      this.filters['s5'].filter.connect(this.filters['s6'].filter);
      this.filters['s6'].filter.connect(this.filters['s7'].filter);
      this.filters['s7'].filter.connect(this.audioContext.destination) */
      this.audioService.invokeInitP5AudioCtx(this.audio);
    }
  }

  async eqToggle() {
    (this.EQEnabled) ? this.disableEQ() : this.enableEQ();
  }

  async enableEQ() {
    this.audioService.changeStateEqEnabled(true);
    if (this.inputStream == undefined || this.inputStream.mediaElement.ended) {
        this.init();
    } else {
        for (var filterID in this.filters) {
            this.filters[filterID].filter.gain.setValueAtTime(parseFloat(this.filters[filterID].gain), this.audioContext.currentTime);
        }
    }
    //this.EQEnabled = true;
  }

  async disableEQ() {
    for (var filterID in this.filters) {
        this.filters[filterID].filter.gain.setValueAtTime(0, this.audioContext.currentTime);
    }


    this.audioService.changeStateEqEnabled(false);
    //this.EQEnabled = false;
  }

  async changeEQGain(sliderName:any, value:any) {
    if (this.filters[sliderName].filter) {
        // Only change gain immediately if enabled, else just store the value to set when enabled
        if (this.EQEnabled) {
            this.filters[sliderName].filter.gain.setValueAtTime(value, this.audioContext.currentTime)
        }
        this.filters[sliderName].gain = value;
    }
  }

  async selectPreset(preset:any) {
    loadExternalJSON('../../../assets/presets.json', 
    (presets:any) => {
        if (presets[preset]) {
            for (let [sliderName, value] of Object.entries(presets[preset])) {
                this.changeEQGain(sliderName, value)
            }
        } else {
            console.error('No entry found for preset: ', preset)
        }
    }, 
    (error:any) => {
        console.error('Error loading preset, ', preset, error)
    })
  }

/* #endregion */
async previousTrack(){
  await this.loadFromQueue(false);
  await this.addToRecentlyPlayed(this.songToPlay);
}

async nextTrack(){
  await this.loadFromQueue(true);
  await this.addToRecentlyPlayed(this.songToPlay);
}


async addToRecentlyPlayed(trackData:any){
  let fixedArray:any[] = await this.dexie.getPlaylist('Recently Played');
  if (fixedArray?.length == 30) {
    await this.dexie.removeFromPlaylist('Recently Played', fixedArray[0]);
    await this.dexie.saveToPlaylist('Recently Played', trackData, true);
  }else{
    await this.dexie.saveToPlaylist('Recently Played', trackData, true);
  }
}


async loadFromQueue(increment:boolean){
  let tracksInQueue:[] = await this.dexie.getPlaybackData("tracksInQueue");
  if (tracksInQueue != null) {
    let trackIndex = tracksInQueue.findIndex((track:any) => track.fileName == this.songToPlay.fileName)
    if (trackIndex || trackIndex == 0) {
      let nextTrack:any = increment == true ? tracksInQueue[++trackIndex] : tracksInQueue[--trackIndex];
      if (nextTrack) {
        this.songToPlay = nextTrack;
        this.uiService.setHighlightedRow(this.songToPlay);
        await this.playAudioFile(nextTrack);
        this.audioService.changeSongMetaData({title: this.currentSong, artist: this.currentArtist, cover:this.coverURL, duration: this.duration, maxTime: this.maxTime, isPlaying:this.isPlaying});
      }else{
        let number = 0
        nextTrack = tracksInQueue[number];
        this.songToPlay = nextTrack;
        this.uiService.setHighlightedRow(this.songToPlay);
        await this.playAudioFile(nextTrack)
        this.audioService.changeSongMetaData({title: this.currentSong, artist: this.currentArtist, cover:this.coverURL, duration: this.duration, maxTime: this.maxTime, isPlaying:this.isPlaying});
      }
    }
  }
}


shuffleOn:boolean = false;
orgQueueOrder:any[];
shuffledArray:any = [];

async toggleShuffle(){
  this.shuffleOn = !this.shuffleOn;
  await this.audioService.changeShuffleOn(this.shuffleOn);
  await this.shuffleQueueOrder();
}

async shuffleQueueOrder(){
  if (this.shuffleOn == true) {
    let respArray = await this.dexie.getPlaybackData("tracksInQueue");
    if (respArray != null && respArray?.length != 0) {
      this.orgQueueOrder = respArray;
      let orgMutableCopy = this.orgQueueOrder.slice();
      if (orgMutableCopy != null) {
        this.shuffledArray = this.shuffleArray(orgMutableCopy);
        await this.dexie.savePlaybackData('tracksInQueue', this.shuffledArray);
      }
    }
  }else if (this.shuffleOn == false){
    if (this.orgQueueOrder != undefined) {
      if (this.orgQueueOrder != null  && this.orgQueueOrder?.length != 0) {
        await this.dexie.savePlaybackData('tracksInQueue', this.orgQueueOrder);
      }
    }
  }
}


repeatOn:boolean = false;
async toggleRepeat(){ 
  this.repeatOn = !this.repeatOn;
  await this.audioService.changeRepeatOn(this.repeatOn);
}


async initMediaSessionAPI(){
  if ('mediaSession' in navigator) {
    console.log('Media Session Api supported!');
    (navigator as any).mediaSession.setActionHandler('play', () => { this.togglePlay(); console.log('%c PLAY ', 'background: #000; color: #00CED1'); });
    (navigator as any).mediaSession.setActionHandler('pause',() => { this.togglePlay(); console.log('%c PAUSE ', 'background: #000; color: #00CED1'); });
    (navigator as any).mediaSession.setActionHandler('stop', () => { this.audio.nativeElement.pause(); console.log('%c STOP ', 'background: #000; color: #00CED1'); });
    (navigator as any).mediaSession.setActionHandler('previoustrack', () => { this.previousTrack(); console.log('%c PREV ', 'background: #000; color: #00CED1'); });
    (navigator as any).mediaSession.setActionHandler('nexttrack', () => { this.nextTrack(); console.log('%c NEXT ', 'background: #000; color: #00CED1'); });
  }
}

async setMediaSessionData(title:string, artist:string, cover:any){
  if ('mediaSession' in navigator) {
    // @ts-ignore
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      artwork: [{src: cover}]
    });
  }
}



/////////////////////////////////////////////
/*   Helper functies  */
///////////////////////////////////////////

  sToTime(t:number) {
    //indien men ook aantal uren wilt laten zien uncomment onderstaande
  /*   return this.padZero(parseInt(((t / (60 * 60)) % 24).toString())) + ":" +
           this.padZero(parseInt(((t / (60)) % 60).toString())) + ":" + 
           this.padZero(parseInt(((t) % 60).toString())) */

    return this.padZero(parseInt(((t / (60)) % 60).toString())) + ":" + 
           this.padZero(parseInt(((t) % 60).toString()))       
  } 

  padZero(v:any) {
    return (v < 10) ? "0" + v : v;
  }

  calcDuration(sec:any){
    var minutes = Math.floor(sec / 60);
    var seconds = sec - minutes * 60;

    var finalTime = this.str_pad_left(minutes,'0',2)+':'+this.str_pad_left(seconds,'0',2);
    return finalTime;
  }

  str_pad_left(string:any,pad:any,length:any) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }

  isOverflown(el:any) {
    //console.log(el.nativeElement.scrollHeight, el.nativeElement.clientHeight, el.nativeElement.scrollWidth ,el.nativeElement.clientWidth)
    return el.nativeElement.scrollHeight > el.nativeElement.clientHeight || el.nativeElement.scrollWidth > el.nativeElement.clientWidth;
  }


  shuffleArray(array:any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
}
