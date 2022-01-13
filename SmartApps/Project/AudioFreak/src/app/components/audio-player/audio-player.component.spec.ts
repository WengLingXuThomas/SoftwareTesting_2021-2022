import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AudioPlayerComponent } from './audio-player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import { DebugElement } from '@angular/core';

import { AudioService } from '../../services/component/audio.service'

import { DexieService } from 'src/app/services/indexdDB/dexie.service';

/* #region Test Case 1 */
  describe('Audio pauzeren en/of hernemen', () => {
    let component: AudioPlayerComponent;
    let fixture: ComponentFixture<AudioPlayerComponent>;
    let togglePlayBtn:DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ AudioPlayerComponent ],
        imports: [
          MatIconModule,
          MatSliderModule,
          MatGridListModule
        ]
      });

      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      //Ignore Chrome AutoPlay policy for testing purposes
      component.audio.nativeElement.muted = true;
      togglePlayBtn = fixture.debugElement.query(By.css('.togglePlayBtn'));
    });

    it('should set playing state to true when play button clicked', () => {
      togglePlayBtn.triggerEventHandler('click', null);  // togglePlay() =>  false => true

      let playingState = component.isPlaying;

      expect(playingState).toBeTruthy();
    });

    it('should set playing state to false when pause button clicked', () => {
      togglePlayBtn.triggerEventHandler('click', null);
      togglePlayBtn.triggerEventHandler('click', null);

      let playingState = component.isPlaying;

      expect(playingState).toBeFalsy();
    });

    it('should call the "play()" method of the HTMLMediaElement when play button clicked ', () => {
      component.audio = {nativeElement: jasmine.createSpyObj('nativeElement', ['play'])};

      togglePlayBtn.triggerEventHandler('click', null);

      expect(component.audio.nativeElement.play).toHaveBeenCalled();
    });

    it('should call the "pause()" method of the HTMLMediaElement when pause button clicked ', () => {
      component.isPlaying = true;

      component.audio = {nativeElement: jasmine.createSpyObj('nativeElement', ['pause'])};

      togglePlayBtn.triggerEventHandler('click', null);

      expect(component.audio.nativeElement.pause).toHaveBeenCalled();
    });

    it('should call the "toggleMarquee()" method when "togglePlay()" is called', () => {
      let method = spyOn(component,'toggleMarquee');
      component.togglePlay();
      expect(method).toHaveBeenCalled();
    });

    it('should call the audioService to notify the playing state to other components', () => {
      let audioService = TestBed.inject(AudioService);
      let service = spyOn(audioService,'changeStateIsPlaying').and.callFake((playingState) => { });

      component.togglePlay(); // isPlaying => true

      expect(service).toHaveBeenCalledWith(true);
    });

  });
 /* #endregion */

 /* #region Test Case 2 */
 describe('Volgende/vorige audio bestand in de wachtrij afspelen', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;
  let dexieService: DexieService;
  let service:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioPlayerComponent ],
      imports: [
        MatIconModule,
        MatSliderModule,
        MatGridListModule
      ]
    });

    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dexieService = TestBed.inject(DexieService);

    component.songToPlay = {fileHandle: null, fileMeta: {title:"song2", genre: "genre2", artist:"artist2", album: "album2"}, fileName: "song2.mp3"};

    service = spyOn(dexieService,'getPlaybackData').and.callFake((key) => { 
      return new Promise((resolve) => {
        resolve(        
          [
            {fileHandle: null, fileMeta: {title:"song1", genre: "genre1", artist:"artist1", album: "album1"}, fileName: "song1.mp3"},
            {fileHandle: null, fileMeta: {title:"song2", genre: "genre2", artist:"artist2", album: "album2"}, fileName: "song2.mp3"},
            {fileHandle: null, fileMeta: {title:"song3", genre: "genre3", artist:"artist3", album: "album3"}, fileName: "song3.mp3"},
            {fileHandle: null, fileMeta: {title:"song4", genre: "genre4", artist:"artist4", album: "album4"}, fileName: "song4.mp3"},
          ]
        )
      });
    });
  });

  it('should play the next song in the queue when next button clicked', async () => {
    let nextBtn = fixture.debugElement.query(By.css('.nextBtn'));

    await nextBtn.triggerEventHandler('click', null);  

    expect(component.songToPlay).toEqual({fileHandle: null, fileMeta: {title:"song3", genre: "genre3", artist:"artist3", album: "album3"}, fileName: "song3.mp3"})
  });

  it('should play the previous song in the queue when previous button clicked', async () => {
    let prevBtn = fixture.debugElement.query(By.css('.prevBtn'));

    await prevBtn.triggerEventHandler('click', null);  

    expect(component.songToPlay).toEqual({fileHandle: null, fileMeta: {title:"song1", genre: "genre1", artist:"artist1", album: "album1"}, fileName: "song1.mp3"})
  });

  });
 /* #endregion */

  /* #region Test Case 3 */
  describe('(un)shufflen van de wachtrij', () => {
    let component: AudioPlayerComponent;
    let fixture: ComponentFixture<AudioPlayerComponent>;
    let dexieService: DexieService;
    let audioService: AudioService;

    let shuffleBtn:DebugElement; 

    let service:any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ AudioPlayerComponent ],
        imports: [
          MatIconModule,
          MatSliderModule,
          MatGridListModule
        ]
      });
  
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  
      audioService = TestBed.inject(AudioService);
      dexieService = TestBed.inject(DexieService);

      shuffleBtn = fixture.debugElement.query(By.css('.shuffleBtn'));

      spyOn(dexieService,'getPlaybackData').and.callFake((key) => { 
        return new Promise((resolve) => {
          resolve(
            [
              {fileHandle: null, fileMeta: {title:"song1", genre: "genre1", artist:"artist1", album: "album1"}, fileName: "song1.mp3"},
              {fileHandle: null, fileMeta: {title:"song2", genre: "genre2", artist:"artist2", album: "album2"}, fileName: "song2.mp3"},
              {fileHandle: null, fileMeta: {title:"song3", genre: "genre3", artist:"artist3", album: "album3"}, fileName: "song3.mp3"},
              {fileHandle: null, fileMeta: {title:"song4", genre: "genre4", artist:"artist4", album: "album4"}, fileName: "song4.mp3"},
            ]
          );
        });
      });
    });

    it('should toggle on the "shuffleOn" state', async () => {
      await shuffleBtn.triggerEventHandler('click', null); 
      let shuffleState = component.shuffleOn;
      expect(shuffleState).toBeTruthy();
    });

    it('should toggle off the "shuffleOn" state', async () => {
      await shuffleBtn.triggerEventHandler('click', null); // false => true
      await shuffleBtn.triggerEventHandler('click', null); // true => false
      let shuffleState = component.shuffleOn;
      expect(shuffleState).toBeFalsy();
    });

    it('should call the audioService to notify the shuffle state to other components', async() => {
      let service = spyOn(audioService,'changeShuffleOn').and.callFake((shuffleState) => { });

      await shuffleBtn.triggerEventHandler('click', null);  // shuffleOn => true

      expect(service).toHaveBeenCalledWith(true);
    });
  
    it('should shuffle the tracks in queue', async () => {
      let originalQueuOrder = await dexieService.getPlaybackData('tracksInQueue');

      await shuffleBtn.triggerEventHandler('click', null); 
      await setTimeout(() => { }, 10000);

      let shuffledQueuOrder = component.shuffledArray;

      expect(shuffledQueuOrder).not.toEqual(originalQueuOrder);
    });

    it('should restore the orginal queue order when shuffle button is toggled off', async () => {
      let originalQueuOrder = await dexieService.getPlaybackData('tracksInQueue');

      await shuffleBtn.triggerEventHandler('click', null); // shuffle on
      await shuffleBtn.triggerEventHandler('click', null); // shuffle off
      await setTimeout(() => { }, 10000);

      let unShuffledQueuOrder = component.orgQueueOrder;

      expect(unShuffledQueuOrder).toEqual(originalQueuOrder);
    });
  });
 /* #endregion */

  /* #region Test Case 4 */
  describe('Hetzelfde liedje herafspelen', () => {
    let component: AudioPlayerComponent;
    let fixture: ComponentFixture<AudioPlayerComponent>;

    let repeatBtn:DebugElement; 
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ AudioPlayerComponent ],
        imports: [
          MatIconModule,
          MatSliderModule,
          MatGridListModule
        ]
      });
  
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  
      repeatBtn = fixture.debugElement.query(By.css('.repeatBtn'));
    });

    it('should toggle on the "repeatOn" state', async () => {
      await repeatBtn.triggerEventHandler('click', null); 
      let repeatState = component.repeatOn;
      expect(repeatState).toBeTruthy();
    });

    it('should toggle off the "repeatOn" state', async () => {
      await repeatBtn.triggerEventHandler('click', null); // false => true
      await repeatBtn.triggerEventHandler('click', null); // true => false
      let repeatState = component.repeatOn;
      expect(repeatState).toBeFalsy();
    });

    it('should call the audioService to notify the repeat state to other components', async() => {
      let audioService = TestBed.inject(AudioService);
      let service = spyOn(audioService,'changeRepeatOn').and.callFake((repeatState) => { });

      await repeatBtn.triggerEventHandler('click', null);  // repeatOn => true

      expect(service).toHaveBeenCalledWith(true);
    });
  });
 /* #endregion */

  /* #region Test Case 5 */
  describe('Een willekeurig tijdstip in een liedje laten afspelen', () => {
    let component: AudioPlayerComponent;
    let fixture: ComponentFixture<AudioPlayerComponent>;
    let currentTimeSldr:DebugElement; 

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ AudioPlayerComponent ],
        imports: [
          MatIconModule,
          MatSliderModule,
          MatGridListModule
        ]
      });
  
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      currentTimeSldr = fixture.debugElement.query(By.css('.currentTimeSldr'));
    });

    it('should set the currentTime of HTMLMediaElement to 60 when currentTimeSlider value changed to 60', async () => {
      await currentTimeSldr.triggerEventHandler('valueChange', 60);
      expect(component.audio.nativeElement.currentTime).toEqual(60);
    });

    it('should set the isPlaying state to true when HTMLMediaElement is paused on slider value change', async () => {
      component.audio.nativeElement.pause();
      await currentTimeSldr.triggerEventHandler('valueChange', 60);
      expect(component.isPlaying).toBeTruthy();
    });

 /*    it('should call the "play()" method of the HTMLMediaElement when HTMLMediaElement is paused on slider value change', async () => {
      component.audio.nativeElement.pause();
      component.audio = {nativeElement: jasmine.createSpyObj('nativeElement', ['play'])};
      await currentTimeSldr.triggerEventHandler('valueChange', 60);
      expect(component.audio.nativeElement.play).toHaveBeenCalled();
    }); */

  });
 /* #endregion */

  /* #region Test Case 6 */
  describe('Het volume dempen/aanzetten', () => {
    let component: AudioPlayerComponent;
    let fixture: ComponentFixture<AudioPlayerComponent>;

    let muteBtn:DebugElement; 
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ AudioPlayerComponent ],
        imports: [
          MatIconModule,
          MatSliderModule,
          MatGridListModule
        ]
      });
  
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  
      muteBtn = fixture.debugElement.query(By.css('.muteBtn'));
    });

    it('should set the mute state to true when mute button clicked', async () => {
      await muteBtn.triggerEventHandler('click', null); 
      let muteState = component.isMuted;
      expect(muteState).toBeTruthy();
    });

    it('should set the mute state to false when mute button clicked', async () => {
      await muteBtn.triggerEventHandler('click', null); 
      await muteBtn.triggerEventHandler('click', null); 
      let muteState = component.isMuted;
      expect(muteState).toBeFalsy();
    });

    it('should set the "muted" property of the HTMLMediaElement to true when mute button clicked', async () => {
      await muteBtn.triggerEventHandler('click', null); 
      expect(component.audio.nativeElement.muted).toBeTruthy();
    });

    it('should set the "muted" property of the HTMLMediaElement to false when mute button clicked', async () => {
      await muteBtn.triggerEventHandler('click', null); 
      await muteBtn.triggerEventHandler('click', null); 
      expect(component.audio.nativeElement.muted).toBeFalsy();
    });

    it('should call the audioService to notify the mute state to other components', async() => {
      let audioService = TestBed.inject(AudioService);
      let service = spyOn(audioService,'changeIsMuted').and.callFake((muteState) => { });

      await muteBtn.triggerEventHandler('click', null);  // isMuted => true

      expect(service).toHaveBeenCalledWith(true);
    });
  });
 /* #endregion */

  /* #region Test Case 7 */
  describe('Het volume niveau aanpassen', () => {
    let component: AudioPlayerComponent;
    let fixture: ComponentFixture<AudioPlayerComponent>;

    let volumeSldr:DebugElement; 
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ AudioPlayerComponent ],
        imports: [
          MatIconModule,
          MatSliderModule,
          MatGridListModule
        ]
      });
  
      fixture = TestBed.createComponent(AudioPlayerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  
      volumeSldr = fixture.debugElement.query(By.css('.volumeSlider'));
    });

    it('should unmute the audio when volume slider value has changed', async () => {
      component.isMuted = true;
      await volumeSldr.triggerEventHandler('change', {value: 50});

      let muteState = component.isMuted;

      expect(muteState).toBeFalsy();
      expect(component.audio.nativeElement.muted).toBeFalsy();
    });

    it('should set the volume of the HTMLMediaElement to 0.72 when volume slider value changed to 72', async () => {
      await volumeSldr.triggerEventHandler('change', {value: 72});
      
      expect(component.audio.nativeElement.volume).toEqual(0.72);
    });

    it('should call the audioService to notify the volume level to other components', async() => {
      let audioService = TestBed.inject(AudioService);
      let service = spyOn(audioService,'changeVolume').and.callFake((volume) => { });
      await volumeSldr.triggerEventHandler('change', {value: 80});

      expect(service).toHaveBeenCalledWith(80);
    });

    it('should call the audioService to notify the volume level to other components', async() => {
      let audioService = TestBed.inject(AudioService);
      let service = spyOn(audioService,'changeVolume').and.callFake((volume) => { });
      await volumeSldr.triggerEventHandler('change', {value: 80});

      expect(service).toHaveBeenCalledWith(80);
    });

    it('should call the dexieService to persist the volume to the indexedDB', async() => {
      let dexieService = TestBed.inject(DexieService);
      let service = spyOn(dexieService,'saveSetting').and.callFake((setting, value) => { 
        return new Promise((resolve) => {resolve(null)})
      });

      await volumeSldr.triggerEventHandler('change', {value: 80});

      expect(service).toHaveBeenCalledWith('volume', 0.8);
    });

  });
 /* #endregion */
