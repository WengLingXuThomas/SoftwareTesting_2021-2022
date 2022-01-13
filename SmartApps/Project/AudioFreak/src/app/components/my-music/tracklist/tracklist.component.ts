import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { defaultTheme, themeOption } from 'src/app/interfaces/themeOption';
import { AudioService } from 'src/app/services/component/audio.service';
import { UiService } from 'src/app/services/component/ui.service';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

import { isTouchDevice } from '../tab-view/tracks-tab/tracks-tab.component'

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.css']
})
export class TracklistComponent implements OnInit, OnChanges, AfterViewInit {
  
  @ViewChild(MatSort) sort: MatSort;
  @Input() tracks:any;

  @Input() showArtistCol:any = false;
  @Input() showAlbumCol:any = false;
  @Input() showRemoveFromPlaylist:any = false;

  Theme:themeOption = defaultTheme;

  onTouchDevice:any = true;
  hideAlbumCol:boolean = false;
  hideArtistCol: boolean = false;

  displayedColumns: string[] = ['title','actions'];

  selectedRow:any = "";

  playlistsOptions: any[];

  constructor(private route: ActivatedRoute, private dexieService:DexieService, private uiService:UiService ,private audioService:AudioService, private breakpointObserver:BreakpointObserver,  private _snackBar: MatSnackBar) {
    this.onTouchDevice = isTouchDevice();

    this.uiService.onThemeColorChange().subscribe(theme => {
      this.Theme = theme;
    })

    this.uiService.onChangeHighlightedRow().subscribe(row => this.rowhighlight(row));
  }

  async ngOnInit() {
    this.tracks = new TableVirtualScrollDataSource();
    this.playlistsOptions = await this.dexieService.getAllPlaylists(); 
    let uiRes = this.uiService.themeColor;
    if (uiRes == null) {
      let resp = await this.dexieService.getSetting("themecolor")
      if (resp != null) {
        this.Theme = resp;
      }
    }else{
      this.Theme = uiRes;
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.tracks.currentValue != undefined) {
      this.tracks.sortingDataAccessor = (item:any, property:any) => {
        switch(property) {
          case 'title': return item.fileMeta.title;
          case 'artist': return item.fileMeta.artist;
          case 'album': return item.fileMeta.album;
          default: return item[property];
        }
      };
      this.tracks.sort = this.sort;
      if (this.audioService.shuffleOn == true) {
        await this.audioService.invokeShuffleQueue();
      }
    }

    if (changes.showArtistCol) {
      if (changes.showArtistCol.currentValue == true) {
        //this.displayedColumns.push('artist');
        this.displayedColumns.splice(this.displayedColumns.length-1, 0,'artist');
      }
    }
    
    if (changes.showAlbumCol) {
      if (changes.showAlbumCol.currentValue == true) {
        //this.displayedColumns.push('album');
        this.displayedColumns.splice(this.displayedColumns.length-1, 0,'album');
      }
    }
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.breakpointObserver.observe(['(max-width:469px)']).subscribe((res) => {
        if (res.matches) {
          if (this.showArtistCol == true && this.showAlbumCol == true) {
            this.hideAlbumCol = true;
          }
        }else{
          this.hideAlbumCol = false;
        }
      })
      
      this.breakpointObserver.observe(['(max-width:325px)']).subscribe((res) => {
        if (res.matches) {
          if (this.showAlbumCol == true && this.showArtistCol == false) {
            this.hideAlbumCol = true;
          }else{
            this.hideArtistCol = true;
          }
        }else{
          this.hideArtistCol = false;
        }
      })
    }, 0);
  }

  async trackClick(trackData:any){
    if(this.audioService.shuffleOn == true){
      await this.dexieService.savePlaybackData('tracksInQueue', this.tracks.filteredData);
      await this.audioService.invokeShuffleQueue();
    }else{
      await this.dexieService.savePlaybackData('tracksInQueue', this.tracks.filteredData);
    }

    this.changeSongToPlay(trackData);
    await this.addToRecentlyPlayed(trackData);
  }

  changeSongToPlay(songHandle:any){
    this.audioService.changeSongToPlay(songHandle);
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

  rowhighlight(row:any){
    this.selectedRow = row.fileName;
    return true;
  }

  async addToPlaylist(playlist:any, track:any){
    console.log(playlist);
    console.log(track);
    let succes = await this.dexieService.saveToPlaylist(playlist.key, track);
    if (!succes) {
      this._snackBar.open("Track already in playlist", null , {duration: 2500});
    }else{
      this._snackBar.open(`"${track.fileMeta.title}" added to ${playlist.key}`, null , {duration: 2000});
    }
  }

  async removeFromPlaylist(track:any){ 
    let key = await this.route.snapshot.paramMap.get('id');
    await this.dexieService.removeFromPlaylist(key,track);
    await this.uiService.invokeGetPlaylistTracks(key);
  }

}
