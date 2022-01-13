import { ElementRef, Injectable } from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  private songToPlay: any = null;
  private subject  = new Subject<any>();
  changeSongToPlay(fileHandle:any): void {
    this.songToPlay = fileHandle;
    console.log(this.songToPlay);
    this.subject.next(this.songToPlay);
  }
  onChangeSong(): Observable<any> {
    return this.subject.asObservable();
  }

  private songMetaData:any;
  private songMetaDataSubject  = new Subject<any>();
  changeSongMetaData(metadata:any): void {
    this.songMetaData = metadata;
    this.songMetaDataSubject.next(this.songMetaData);
  }
  onChangeSongMetaData(): Observable<any> {
    return this.songMetaDataSubject.asObservable();
  }

  private currentTimeSong:any;
  private currentTimeSongSubject  = new Subject<any>();
  changeCurrentTimeSong(currentTime:any): void {
    this.currentTimeSong = currentTime;
    this.currentTimeSongSubject.next(this.currentTimeSong);
  }
  onChangeCurrentTimeSong(): Observable<any> {
    return this.currentTimeSongSubject.asObservable();
  }

  private timeSliderVal:any;
  private timeSliderValSubject  = new Subject<any>();
  changeTimeSliderValue(value:any): void {
    this.timeSliderVal = value;
    this.timeSliderValSubject.next(this.timeSliderVal);
  }
  onChangeTimeSliderValue(): Observable<any> {
    return this.timeSliderValSubject.asObservable();
  }

  private invokeChangeCurTimeValue:any;
  private invokeChangeCurTimeSubject = new Subject<any>();
  invokeChangeCurTime(value:any){
    this.invokeChangeCurTimeValue = value;
    this.invokeChangeCurTimeSubject.next(this.invokeChangeCurTimeValue)
  }
  onInvokeChangeCurTime(){
    return this.invokeChangeCurTimeSubject.asObservable();
  }

  
  private invokeTogglePreviousSubject = new Subject<void>();
  invokeTogglePrevious(){
    this.invokeTogglePreviousSubject.next();
  }
  onInvokeTogglePrevious(){
    return this.invokeTogglePreviousSubject.asObservable();
  }

  private invokeTogglePlaySubject = new Subject<void>();
  invokeTogglePlay(){
    this.invokeTogglePlaySubject.next();
  }
  onInvokeTogglePlay(){
    return this.invokeTogglePlaySubject.asObservable();
  }

  private invokeToggleNextSubject = new Subject<void>();
  invokeToggleNext(){
    this.invokeToggleNextSubject.next();
  }
  onInvokeToggleNext(){
    return this.invokeToggleNextSubject.asObservable();
  }

  private invokeToggleShuffleSubject = new Subject<void>();
  invokeToggleShuffle(){
    this.invokeToggleShuffleSubject.next();
  }
  onInvokeToggleShuffle(){
    return this.invokeToggleShuffleSubject.asObservable();
  }

  private invokeToggleRepeatSubject = new Subject<void>();
  invokeToggleRepeat(){
    this.invokeToggleRepeatSubject.next();
  }
  onInvokeToggleRepeat(){
    return this.invokeToggleRepeatSubject.asObservable();
  }

  private invokeOnMuteSubject = new Subject<void>();
  invokeOnMute(){
    this.invokeOnMuteSubject.next();
  }
  onInvokeOnMute(){
    return this.invokeOnMuteSubject.asObservable();
  }


  private invokeAdjustVolumeSubject = new Subject<any>();
  invokeAdjustVolume(e:any){
    this.invokeAdjustVolumeSubject.next(e);
  }
  onInvokeAdjustVolume(){
    return this.invokeAdjustVolumeSubject.asObservable();
  }

  

  private isPlaying: boolean;
  private isPlayingSubject = new Subject<boolean>();
  changeStateIsPlaying(bool:boolean){
    this.isPlaying = bool;
    this.isPlayingSubject.next(this.isPlaying);
  }
  onChangeStateIsPlaying(){
    return this.isPlayingSubject.asObservable();
  }

  private invokeResetPlayerVal: boolean;
  private invokeResetPlayerSubject = new Subject<boolean>();
  invokeResetPlayer(bool:boolean){
    this.invokeResetPlayerVal = bool;
    this.invokeResetPlayerSubject.next(this.invokeResetPlayerVal)
  }
  onInvokeResetPlayer(){
    return this.invokeResetPlayerSubject.asObservable();
  }




/* #region  EQ observables */
  public eqEnabled:boolean = false;
  private eqEsubject = new Subject<any>();
  changeStateEqEnabled(state:boolean){
    this.eqEnabled = state;
    this.eqEsubject.next(this.eqEnabled);
  }
  onStateEqEnabledChanged(): Observable<any> {
    return this.eqEsubject.asObservable();
  }

  public filters:any = null;
  private filterSubject = new Subject<any>();
  changeFilters(filters:any){
    this.filters = filters;
    this.filterSubject.next(this.filters);
  }
  onFiltersChanged(){
    return this.filterSubject.asObservable();
  }

  private onSliderGainParams = {};
  private onSliderGainSubject = new Subject<any>();
  invokeOnSliderGain(params:any){
    this.onSliderGainParams = params;
    this.onSliderGainSubject.next(this.onSliderGainParams);
  }
  onSliderGain(){
    return this.onSliderGainSubject.asObservable();
  }

  private onPresetSelectParams = {};
  private onPresetSelectSubject = new Subject<any>();
  invokeOnPresetSelect(params:any){
    this.onPresetSelectParams = params;
    this.onPresetSelectSubject.next(this.onPresetSelectParams);
  }
  onPresetSelect(){
    return this.onPresetSelectSubject.asObservable();
  }

  private onEQToggleSubject = new Subject<void>();
  invokeOnEQToggle(){
    this.onEQToggleSubject.next();
  }
  onEQToggle(){
    return this.onEQToggleSubject.asObservable();
  }

/* #endregion */


  private mainAudioSource:any;
  private mainAudioSourceSubject = new Subject<any>();
  updateMainAudioSource(source:any, p5Ref:any, ctx:any){
    this.mainAudioSource = source;
    this.mainAudioSourceSubject.next({mediaSrc:this.mainAudioSource, P5Ref:p5Ref, Ctx: ctx});
  }
  onUpdateMainAudioSource(){
    return this.mainAudioSourceSubject.asObservable();
  }

  private invokeInitP5AudioCtxSubject = new Subject<any>();
  invokeInitP5AudioCtx(audioEl:any){
    this.invokeInitP5AudioCtxSubject.next({audioEL:audioEl});
  }
  onInvokeInitP5AudioCtx(){
    return this.invokeInitP5AudioCtxSubject.asObservable();
  }



  public audioEl:ElementRef;
  private audioElSubject = new Subject<ElementRef>();
  updateAudioEl(elementRef:ElementRef){
    this.audioEl = elementRef;
    this.audioElSubject.next(this.audioEl);
  }
  onUpdateAudioEl(): Observable<ElementRef>{
    return this.audioElSubject.asObservable();
  }

  public shuffleOn:boolean = false;
  private shuffleOnSubject = new Subject<boolean>();
  changeShuffleOn(on:boolean){
    this.shuffleOn = on;
    this.shuffleOnSubject.next(this.shuffleOn);
  }
  onChangeShuffleOn(): Observable<boolean>{
    return this.shuffleOnSubject.asObservable();
  }

  public repeatOn:boolean = false;
  private repeatOnSubject = new Subject<boolean>();
  changeRepeatOn(on:boolean){
    this.repeatOn = on;
    this.repeatOnSubject.next(this.repeatOn);
  }
  onChangeRepeatOn(): Observable<boolean>{
    return this.repeatOnSubject.asObservable();
  }

  public isMuted:boolean = false;
  private isMutedSubject = new Subject<boolean>();
  changeIsMuted(muted:boolean){
    this.isMuted = muted;
    this.isMutedSubject.next(this.isMuted);
  }
  onChangeIsMuted(): Observable<boolean>{
    return this.isMutedSubject.asObservable();
  }

  public volume:number = 100;
  private volumeSubject = new Subject<number>();
  changeVolume(level:number){
    this.volume = level;
    this.volumeSubject.next(this.volume);
  }
  onChangeVolume(): Observable<number>{
    return this.volumeSubject.asObservable();
  }

 

  

  private invokeShuffleQueueSubject = new Subject<void>();
  invokeShuffleQueue(){
    this.invokeShuffleQueueSubject.next();
  }
  onInvokeShuffleQueue(){
    return this.invokeShuffleQueueSubject.asObservable();
  }


}
