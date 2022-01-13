import { Component, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { AudioService } from '../../../../services/component/audio.service';

import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import { BreakpointObserver } from '@angular/cdk/layout'
import { UiService } from '../../../../services/component/ui.service';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';
import { themeOption, defaultTheme } from '../../../../interfaces/themeOption';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-tracks-tab',
  templateUrl: './tracks-tab.component.html',
  styleUrls: ['./tracks-tab.component.css']
})
export class TracksTabComponent implements OnInit, AfterViewInit, OnChanges {

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

   //tabelheaders
   displayedColumns: string[] = ['title', 'artist', 'album', 'actions'];

   playlistsOptions: any[];

   @Input() Tracks: any;

   songToPlay: any = null;
   audioServiceSubscription: Subscription;
   uiServiceSubscription: Subscription;

   selectedRow:any = "";

   Theme:themeOption = defaultTheme;

   onTouchDevice:any = true;
   hideAlbumCol:boolean = false;
   hideArtistCol:boolean = false;

  constructor(private dexieService:DexieService, private audioService:AudioService, private breakpointObserver:BreakpointObserver, private uiService:UiService,  private _snackBar: MatSnackBar) {
    this.audioServiceSubscription = this.audioService.onChangeSong().subscribe((value => this.songToPlay = value));
    this.uiService.onThemeColorChange().subscribe(theme => {
      this.Theme = theme;
    })

    this.onTouchDevice = isTouchDevice();

    this.uiService.onChangeHighlightedRow().subscribe(row => this.rowhighlight(row));
  }

  async ngOnInit(){
    this.Tracks = new TableVirtualScrollDataSource();
    await this.initData(false);

    if (this.audioService.shuffleOn == true) {
      await this.audioService.invokeShuffleQueue();
    }
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

  async initData(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      await this.initTracks(forceReload);
      this.Tracks.sortingDataAccessor = (item:any, property:any) => {
        switch(property) {
          case 'title': return item.fileMeta.title;
          case 'artist': return item.fileMeta.artist;
          case 'album': return item.fileMeta.album;
          default: return item[property];
        }
      };
      this.Tracks.sort = this.sort;
      resolve("succes");
    })
  }

  async initTracks(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      switch (forceReload) {
        case false:
          this.Tracks = await this.dexieService.getLoadedLocalTracks();
          if(this.Tracks.filteredData.length == 0){
            let dataPresent = await this.dexieService.dataLocalTracksPresent();
            if( dataPresent == true){
              this.initTracks(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            console.log("Component Data tracks",this.Tracks);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalTracksPresent();
          if( dataPresent == true){
            this.Tracks = await this.dexieService.getLoadedLocalTracks();
            console.log("retrieving data");
          }else{
            console.log("no data to retrieve");
          }    
          break;
      }

      resolve("succes");
    })
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.Tracks.currentValue != undefined) {
      console.log("Local tracks initialized");
      //this.Tracks.paginator = this.paginator;

    }

  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.breakpointObserver.observe(['(max-width:469px)']).subscribe((res) => {
        if (res.matches) {
          this.hideAlbumCol = true;
        }else{
          this.hideAlbumCol = false;
        }
      })

      this.breakpointObserver.observe(['(max-width:325px)']).subscribe((res) => {
        if (res.matches) {
          this.hideArtistCol = true;
        }else{
          this.hideArtistCol = false;
        }
      })
    }, 0);
  }
 
  async trackClick(trackData:any){
    if(this.audioService.shuffleOn == true){
      await this.dexieService.savePlaybackData('tracksInQueue', this.Tracks.filteredData);
      await this.audioService.invokeShuffleQueue();
    }else{
      await this.dexieService.savePlaybackData('tracksInQueue', this.Tracks.filteredData);
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
      this._snackBar.open(`"${track.fileMeta.title}" added to ${playlist.key}`, null , {duration: 2500});
    }
  }

}

export function  isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     ((navigator as any).msMaxTouchPoints > 0));
}
