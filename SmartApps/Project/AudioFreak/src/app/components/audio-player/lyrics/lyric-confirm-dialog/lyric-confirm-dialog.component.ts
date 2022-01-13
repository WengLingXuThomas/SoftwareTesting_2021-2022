import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {findLyrics} from '../../../../../assets/libs/lyricsApiWrapper'

export interface DialogData {
  lyricText:string;
}

@Component({
  selector: 'app-lyric-confirm-dialog',
  templateUrl: './lyric-confirm-dialog.component.html',
  styleUrls: ['./lyric-confirm-dialog.component.css']
})
export class LyricConfirmDialogComponent implements OnInit {

  modifyLyrics: boolean = false;
  disableSearch: boolean = true;

  searchTitle:string = "";
  searchArtist:string = "";

  showSpinner:boolean = false;

  modifiedLyrics:string = "";

  disableSave:boolean = true;
  disableClear: boolean = true;

  dialogRespType:string;

  constructor(public dialogRef: MatDialogRef<LyricConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {

  }

  async searchLyrics(){
    if (this.searchTitle != "" && this.searchArtist != "") {
      this.showSpinner = true;
      await findLyrics(this.searchTitle.trim().toLowerCase(),this.searchArtist.trim().toLowerCase()).then((response:any) => {
        this.showSpinner = false;
        console.log('Modified APICALL', response);
        if (!('error' in response)) {
          this.modifiedLyrics = response.lyrics;
          this.disableSave = false;
          this.dialogRespType = 'manual';
        }else{
          this.disableSave = true;
          this.modifiedLyrics = "No result";
        }
        this.disableClear = false;
      });
    }else{
      this.disableSearch = true;
    }
  }

  onInputChange(){
    this.disableClear = false;
    if (this.searchTitle != "" && this.searchArtist != "") {
      this.disableSearch = false;
    }else{
      this.disableSearch = true;
    }
  }

  onTxtAreaChange(){
    if (this.modifiedLyrics != "") {
      this.disableSave = false;
      this.dialogRespType = 'custom';
    }else{
      this.disableSave = true;
      this.dialogRespType = '';
    }
  }

  saveModLyrics(){
    if (this.modifiedLyrics != '') {
      if (this.modifiedLyrics != 'No result') {
        this.dialogRef.close({resp:this.dialogRespType, lyrics: this.modifiedLyrics});
      }
    }
  }

  clearResults(resetAll:boolean){
    if (resetAll == true) {
      this.disableSearch = true;
    }

    this.searchTitle = "";
    this.searchArtist = "";
    this.modifiedLyrics = "";
    this.disableSave = true;
    this.disableClear = true;
  }

  resetSetLyric(){
    this.clearResults(true);
  }

}
