import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UiService } from 'src/app/services/component/ui.service';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { isTouchDevice } from '../tab-view/tracks-tab/tracks-tab.component';
@Component({
  selector: 'app-artist-view',
  templateUrl: './artist-view.component.html',
  styleUrls: ['./artist-view.component.css']
})
export class ArtistViewComponent implements OnInit {

  Tracks:any;
  ArtistTracks: any;
  artistID: number;
  artistName:string = "Artist";

  Albums:any;
  ArtistAlbums:any;
  defaultImgURL:any = "../../assets/images/no_album_art.jpg";
  albumImgArray:any[] = [];

  showCarousel:boolean = false;
  onTouchDevice:any = true;

  constructor(private route: ActivatedRoute, private router: Router, private dexieService:DexieService, private uiService:UiService) {
    this.onTouchDevice = isTouchDevice();
  }

  async ngOnInit(){
    setTimeout(() => {
      this.uiService.changeNavTitle("My Music");
    }, 0);
    this.route.params.subscribe((params: Params) => {
      this.artistID = params['id'];
      this.artistName = params['name'];
    });
    await this.initTracks(false);
    this.getArtistTracks(this.artistID);
    await this.initAlbums(false);
    this.getArtistAlbums(this.artistID);
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

  getArtistTracks(artistId:any){

    if (artistId == "null") {
      this.ArtistTracks = this.Tracks.filteredData.filter((track:any) => track.fileMeta.ArtistID == null || track.fileMeta.artist.trim().toLowerCase() == "unknown");
    }else{
      this.ArtistTracks = this.Tracks.filteredData.filter((track:any) => track.fileMeta.ArtistID == artistId);
    }

    this.ArtistTracks = new TableVirtualScrollDataSource(this.ArtistTracks);
  }

  async initAlbums(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      switch (forceReload) {
        case false:
          this.Albums = await this.dexieService.getLoadedLocalAlbums();
          if(this.Albums == undefined){
            let dataPresent = await this.dexieService.dataLocalAlbumsPresent();
            if( dataPresent == true){
              this.initAlbums(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            console.log("Component Data albums",this.Albums);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalAlbumsPresent();
          if( dataPresent == true){
            this.Albums = await this.dexieService.getLoadedLocalAlbums();
            console.log("retrieving data");
          }else{
            console.log("no data to retrieve");
          }  
          break;
      }

      resolve("succes");
    })
  }

  getArtistAlbums(artistId:any){

    if (artistId == "null") {
      this.ArtistAlbums = this.Albums.filter((data:any) => data.album.ArtistId == null || data.album.ArtistId == "null" || data.artist?.trim().toLowerCase() == "unknown");
    }else{
      this.ArtistAlbums = this.Albums.filter((data:any) => data.album.ArtistId == artistId);
    }

    if (this.ArtistAlbums.length > 0) {
      this.showCarousel = true;
    }else{
       this.showCarousel = false;
    }
  }

  routeAlbumView(albumId: number, title: string){
    this.router.navigate(['/my-music',{outlets: { mymusicContent: ['album', albumId, title] }}]);
  }

}
