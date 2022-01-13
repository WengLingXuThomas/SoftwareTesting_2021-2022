import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-create-playlist-dialog',
  templateUrl: './create-playlist-dialog.component.html',
  styleUrls: ['./create-playlist-dialog.component.css']
})
export class CreatePlaylistDialogComponent implements OnInit {

  name = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<CreatePlaylistDialogComponent   >,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dexieService:DexieService, 
    private _snackBar: MatSnackBar) {}  

  ngOnInit(): void {
  }

  async checkForm(){
    if (this.name.invalid) {
      this.name.markAsTouched();
    }else{
      let idbResp = await this.dexieService.getPlaylist(this.name.value);
      console.log("check name:", idbResp);
      if(idbResp == null){
        if (this.name.value.toLowerCase() == "favorites" || this.name.value.toLowerCase() == "recently played") {
          this.showSnackbar("Reserved playlist name");
        }else{
          this.dialogRef.close(this.name.value);
        }

      }else{
        if (this.name.value.toLowerCase() == "favorites" || this.name.value.toLowerCase() == "recently played") {
          this.showSnackbar("Reserved playlist name");
        }else{
          this.showSnackbar("There is already a playlist with this name!, Please enter a different name");
        }
      }

    }
  }

  showSnackbar(text:string){
    this._snackBar.open(text, null , {duration: 2500});
  }

  getErrorMessage() {
    if (this.name.hasError('required')) {
      return 'You must enter a value';
    }

    return this.name.hasError('name') ? 'Not a valid name' : '';
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
