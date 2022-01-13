import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AudioService } from 'src/app/services/component/audio.service';
import { UiService } from 'src/app/services/component/ui.service';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';
import { CreatePlaylistDialogComponent } from '../create-playlist-dialog/create-playlist-dialog.component';

@Component({
  selector: 'app-playlists-overview',
  templateUrl: './playlists-overview.component.html',
  styleUrls: ['./playlists-overview.component.css']
})
export class PlaylistsOverviewComponent implements OnInit {

  @Input() Playlists: any;

  constructor(private audioService:AudioService,private uiService:UiService, public dialog: MatDialog, private dexieService:DexieService, private router: Router) { }

  async ngOnInit(){
    setTimeout(() => {
      this.uiService.changeNavTitle("Playlists");
    }, 0);

    await this.initPlaylistsData();

  }

  async initPredefinedPlaylist() {
    let predeinedPlaylists:any[] = [
      {key:"Favorites", value: []},
      {key:"Recently Played", value: []},
    ];

    await this.dexieService.saveMultiplePlaylist(predeinedPlaylists);
  }

  async initPlaylistsData(){

    let idbResp:[] = await this.dexieService.getAllPlaylists();
    if (idbResp.length != 0 ) {
      this.Playlists = idbResp;
      this.showPredefinedPlaylistsFirst();
    }else{
      await this.initPredefinedPlaylist();
      await this.initPlaylistsData();
    }
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(CreatePlaylistDialogComponent, {
      width: '250px',
      data: {name: ""},
    });

    dialogRef.afterClosed().subscribe(async name => {
      console.log('The dialog was closed');
      if (name != undefined) {
        console.log("Playlist saved:",name);
        await this.dexieService.savePlaylist(name, []);
        this.initPlaylistsData();
      }

    });
  }


  async deletePlaylist(key:any) { 
    await this.dexieService.deletePlaylist(key);
    this.initPlaylistsData();
  }

  async playPlaylist(playlist:any){
    await this.dexieService.savePlaybackData('tracksInQueue', playlist.value);
    await this.audioService.changeSongToPlay(playlist.value[0]);
    await this.addToRecentlyPlayed(playlist.value[0]);

    if (playlist.key == "Recently Played") {
      this.initPlaylistsData();
    }
  }

  async addToRecentlyPlayed(trackData:any){
    let fixedArray:any[] = await this.dexieService.getPlaylist('Recently Played');
    if (fixedArray?.length == 30) {
      await this.dexieService.removeFromPlaylist('Recently Played', fixedArray[0]);
      await this.dexieService.saveToPlaylist('Recently Played', trackData, true);
    }else{
      await this.dexieService.saveToPlaylist('Recently Played', trackData, true);
    }
  }

  routePlaylistView(name:any){
    this.router.navigate(['/playlists',{outlets: { playlistsOutlet: ['playlist', name] }}]);
  }
  
  showPredefinedPlaylistsFirst(){
    this.arraymove(this.Playlists, this.findIndexInArray(this.Playlists, "Recently Played") , 0);
    this.arraymove(this.Playlists, this.findIndexInArray(this.Playlists, "Favorites") , 0);
  }
  
  findIndexInArray(array:any[], key:string){
    let resp = array.find( (a:any) => a.key == key );
    let respIndex = array.indexOf(resp);
    return respIndex;
  }

  arraymove(arr:any, fromIndex:number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

}
