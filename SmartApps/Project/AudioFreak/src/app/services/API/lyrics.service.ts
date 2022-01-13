import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DexieService } from '../indexdDB/dexie.service';

@Injectable({
  providedIn: 'root'
})
export class LyricsService {

  constructor(private dexieService:DexieService) { }

  private subjectInvokeFetchLyrics  = new Subject<void>();
  invokeFetchLyrics(){
    this.subjectInvokeFetchLyrics.next();
  }
  
  onInvokeFetchLyrics(){
    return this.subjectInvokeFetchLyrics.asObservable();
  }

  async getLyrics(title:string,artist:string){
    return new Promise<any>(async (resolve, reject) => {
      resolve(await this.dexieService.getLyric(title,artist))
    })
  }

  async saveLyric(title:string, artist:string, text:string){
    return new Promise<any>(async (resolve, reject) => {
      resolve(await this.dexieService.saveLyric(title,artist,text));
    })
  }

  async deleteLyric(title:string, artist:string){
    return new Promise<any>(async (resolve, reject) => {
      resolve(await this.dexieService.deleteLyric(title,artist));
    })
  }
 
  private subjectInvokeClearLyric  = new Subject<void>();
  invokeClearLyric(){
    this.subjectInvokeClearLyric.next();
  }
  onInvokeClearLyric(){
    return this.subjectInvokeClearLyric.asObservable();
  }


  public lyricPresent: boolean;
  private lyricPresentSubject = new Subject<boolean>();

  changelyricPresent(present:boolean):void{
    this.lyricPresent = present;
    this.lyricPresentSubject.next(this.lyricPresent)
  }
  onChangelyricPresent():Observable<boolean>{
    return this.lyricPresentSubject.asObservable();
  }

}
