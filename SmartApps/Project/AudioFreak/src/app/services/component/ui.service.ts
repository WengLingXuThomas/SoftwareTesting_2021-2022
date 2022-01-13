import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {themeOption, defaultTheme} from '../../interfaces/themeOption'

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private navbarTitle: string = "";
  private subjectTitle  = new Subject<any>();

  private showSpinner: boolean = false;
  private subjectSpinner = new Subject<any>();

  private toggleFV: boolean = false;
  private subjectFV = new Subject<any>();

  public toggleVis: boolean = false;
  private toggleVisSubject = new Subject<boolean>();

  public vis2Show:string = "wave";
  private vis2ShowSubject = new Subject<string>();

  
/*   private songData:any;
  private subjectSongData = new Subject<any>(); */


  constructor() { }

  changeNavTitle(title:string): void {
    this.navbarTitle = title;
    this.subjectTitle.next(this.navbarTitle);
  }
  onNavTitleChange(): Observable<any> {
    return this.subjectTitle.asObservable();
  }

  changeStateSpinner(bool:boolean): void {
    this.showSpinner = bool;
    this.subjectSpinner.next(this.showSpinner)
  }
  
  onSpinnerStateChange(){
    return this.subjectSpinner.asObservable();
  }

  toggleFullView(bool:boolean){
    this.toggleFV = bool;
    this.subjectFV.next(this.toggleFV);
  }

  onToggleFullView(){
    return this.subjectFV.asObservable();
  }

  toggleVisualizer(bool:boolean){
    this.toggleVis = bool;
    this.toggleVisSubject.next(this.toggleVis);
  }
  onToggleVisualizer(){
    return this.toggleVisSubject.asObservable();
  }

  changeVis2Show(value:string){
    this.vis2Show = value;
    this.vis2ShowSubject.next(this.vis2Show);
  }
  onChangeVis2Show(){
    return this.vis2ShowSubject.asObservable();
  }


  private visCanvasWidth:any;
  private visCanvasHeight:any;
  private subjectCanvasPrefDims  = new Subject<any>();
  setVisCanvasPrefDims(width:any, height:any){
    this.visCanvasWidth = width;
    this.visCanvasHeight = height;
    this.subjectCanvasPrefDims.next({'width':width,'height':height});
  }

  getVisCanvasPrefDims(){
    return {width:this.visCanvasWidth, height:this.visCanvasHeight}
  }
  
  onChangeVisCanvasPrefDims(){
    return this.subjectCanvasPrefDims.asObservable();
  }

  private subjectInvokeInitMyMusicData  = new Subject<void>();
  invokeInitMyMusicData(){
    this.subjectInvokeInitMyMusicData.next();
  }
  onInvokeInitMyMusicData(){
    return this.subjectInvokeInitMyMusicData.asObservable();
  }


  /* #region Theme Color related */

  public themeColor: themeOption = defaultTheme;
  private themeColorSubject = new Subject<themeOption>();

  setThemeColor(themecolor:themeOption):void{
    this.themeColor = themecolor;
    this.themeColorSubject.next(this.themeColor)
  }
  onThemeColorChange():Observable<themeOption>{
    return this.themeColorSubject.asObservable();
  }
  /* #endregion */

 /* #region  Youtube related */

 private PiPstatus:boolean = false;
 private PipStatusSubject = new Subject<boolean>();
 private iFrameData:any;
 private iFrameDataSubject = new Subject<any>();

 togglePiPStatus(iframeData:any):void{
    this.PiPstatus = !this.PiPstatus;
    this.PipStatusSubject.next(this.PiPstatus)
    if(iframeData != null){
      this.iFrameData = iframeData;
      this.iFrameDataSubject.next(this.iFrameData)

    }

  }

onTogglePiPStatus():Observable<boolean>{
  return this.PipStatusSubject.asObservable();
}

getIframeData():Observable<any>{
  return this.iFrameDataSubject.asObservable();
}
 /* #endregion */

 
 public highlightedRow: any = null;
 private highlightedRowSubject = new Subject<any>();

 setHighlightedRow(rowData:any):void{
   this.highlightedRow = rowData;
   this.highlightedRowSubject.next(this.highlightedRow)
 }
 onChangeHighlightedRow():Observable<any>{
   return this.highlightedRowSubject.asObservable();
 }


 private onCacheClearSubject = new Subject<void>();

 cacheClearedNotify():void{
   this.onCacheClearSubject.next();
 }
 onCacheCleared():Observable<void>{
   return this.onCacheClearSubject.asObservable();
 }



  private invokeGetPlaylistTracksSubject = new Subject<any>();
  invokeGetPlaylistTracks(key:any){
    this.invokeGetPlaylistTracksSubject.next(key)
  }
  onInvokeGetPlaylistTracks(){
    return this.invokeGetPlaylistTracksSubject.asObservable();
  }


 
/* 
  updateSongData(data:any){
    this.songData = data;
    this.subjectSongData.next(this.songData);
  }

  onUpdateSongData(){
    return this.subjectSongData.asObservable();
  } */


}

