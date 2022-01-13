import { Component, Input, OnInit} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {findLyrics} from '../../../../assets/libs/lyricsApiWrapper'
import {LyricsService} from '../../../services/API/lyrics.service'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { LyricConfirmDialogComponent } from './lyric-confirm-dialog/lyric-confirm-dialog.component'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface Lyric{
  songTitle: string,
  artist: string,
  text: string,
  timeAdded:Date
}


@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit{

  lyrics:string;
  noLyrics:Boolean = true;

  isFetchingLyrics:boolean = false;

  @Input() songData:any; 
  @Input() toggleReadability:boolean = false;

  invokeFetchLyricsSubscription:Subscription;

  private lyricsColSubscription:Subscription;

  constructor(private lyricsService:LyricsService, private afs: AngularFirestore, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.invokeFetchLyricsSubscription = lyricsService.onInvokeFetchLyrics().subscribe(async () => {
      let respIDB = await this.lyricsService.getLyrics(this.songData.title.trim().toLowerCase(),this.songData.artist.trim().toLowerCase());
      console.log("IDB",respIDB);
      if (respIDB.res == true){
        this.lyrics = respIDB.lyrics.Text;
        this.noLyrics = false;
      }else if(respIDB.res == false){
        this.noLyrics = true;
      } 
    })

    this.lyricsService.onInvokeClearLyric().subscribe(() => {
      this.clearLyric();
    })
  }

  async ngOnInit(){

  }

  async FetchLyrics(){
    if (this.songData.title != "" && this.songData.artist != "") {

      this.isFetchingLyrics = true;

      let respIDB = await this.lyricsService.getLyrics(this.songData.title.trim().toLowerCase(),this.songData.artist.trim().toLowerCase());
      console.log("IDB",respIDB);
      if (respIDB.res == false) {

        if(navigator.onLine == false){
          this.isFetchingLyrics = false; let config = new MatSnackBarConfig(); config.duration = 2500; config.panelClass = ['noConnection']; this._snackBar.open("No Internet Connection", null , config);
        }else{
          this.lyricsColSubscription = this.afs.collection('Lyrics', ref => ref.where('artist', '==', `${this.songData.artist.trim().toLowerCase()}`).where('songTitle', '==', `${this.songData.title.trim().toLowerCase()}`)).valueChanges().subscribe(async (data:any[]) => {
            console.log("FIRESTORE",data);
            if (data.length != 0) {
                this.lyrics = this.convertWhiteSpacing(data[0].text);
                this.noLyrics = false;
  
                let resp = await this.lyricsService.saveLyric(data[0].songTitle, data[0].artist, this.lyrics);
                console.log("SAVED_TO_IDB", resp);
                await this.lyricsService.changelyricPresent(true);
            }else{
              await findLyrics(this.songData.title.trim().toLowerCase(),this.songData.artist.trim().toLowerCase()).then((response:any) => {
                console.log('APICALL', response);
  
                const dialogRef = this.dialog.open(LyricConfirmDialogComponent, {
                  data: {
                    lyricText:response.lyrics,
                  },
                });
                
                dialogRef.afterClosed().subscribe( async dialogResp => {
                  console.log("dialog close response",dialogResp)
                  if (dialogResp != undefined) {
                    switch (dialogResp.resp) {
                      case "correct":
                        this.lyrics = response.lyrics;
                        this.noLyrics = false;
                        let resp = await this.lyricsService.saveLyric(this.songData.title.trim().toLowerCase(),this.songData.artist.trim().toLowerCase(),response.lyrics);
                        console.log("SAVED_TO_IDB", resp);
                        await this.lyricsService.changelyricPresent(true);
                        this.afs.collection('Lyrics').add({
                          artist: this.songData.artist.trim().toLowerCase(),
                          songTitle:this.songData.title.trim().toLowerCase(),
                          text:response.lyrics,
                          timeAdded: new Date(),
                        })
                        .then(res => {
                            console.log("SAVED_TO_FIRESTORE", res);
                        })
                        .catch(e => {
                            console.log(e);
                        });
                      break;
                      case "manual":
                        this.lyrics = dialogResp.lyrics;
                        this.noLyrics = false;
    
                        let resp2 = await this.lyricsService.saveLyric(this.songData.title.trim().toLowerCase(),this.songData.artist.trim().toLowerCase(),dialogResp.lyrics);
                        console.log("SAVED_TO_IDB", resp2);
                        await this.lyricsService.changelyricPresent(true);
                        this.afs.collection('Lyrics').add({
                          artist: this.songData.artist.trim().toLowerCase(),
                          songTitle:this.songData.title.trim().toLowerCase(),
                          text:dialogResp.lyrics,
                          timeAdded: new Date(),
                        })
                        .then(res => {
                            console.log("SAVED_TO_FIRESTORE", res);
                        })
                        .catch(e => {
                            console.log(e);
                        });
                      break; 
                      case "custom":
                        this.lyrics = dialogResp.lyrics;
                        this.noLyrics = false;
                        let resp3 = await this.lyricsService.saveLyric(this.songData.title.trim().toLowerCase(),this.songData.artist.trim().toLowerCase(),dialogResp.lyrics);
                        console.log("SAVED_TO_IDB", resp3);
                        await this.lyricsService.changelyricPresent(true);
                      break;
                    }
                  }
                });
  
              });
  
           
            }
            
            this.isFetchingLyrics = false;
            this.lyricsColSubscription.unsubscribe();
          });
        }

      }else if(respIDB.res == true){
        this.lyrics = respIDB.lyrics.Text;
        this.noLyrics = false;
        this.isFetchingLyrics = false;

        await this.lyricsService.changelyricPresent(true);
      }


    }
  }

  convertWhiteSpacing(lyrics:string):string{
    let str = lyrics.replace(/\\r/g, "\r");
    str = str.replace(/\\t/g, "\t");
    str = str.replace(/\\n/g, "\n");

    return str;
  }

  clearLyric(){
    this.noLyrics = true;
    this.lyrics = "";
    this.lyricsService.changelyricPresent(false);
  }


}
