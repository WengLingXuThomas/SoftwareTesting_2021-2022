import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

interface IComplexItem {
  album: any;
  artist: any;
  coverData:any;
}

@Component({
  selector: 'app-albums-tab',
  templateUrl: './albums-tab.component.html',
  styleUrls: ['./albums-tab.component.css']
})
export class AlbumsTabComponent implements OnInit, OnChanges {
  Albums: any;
  defaultImgURL:any = "../../../assets/images/no_album_art.jpg";

  showListView:boolean = false;
  noAlbums:boolean = false;

  constructor(public domSrv: DomSanitizer, private dexieService:DexieService, private router: Router) { }

  async ngOnInit(){

    await this.dexieService.getSetting('albumView').then((data) => {
      if (data != null) {
        if (data.name == 'List View') {
          this.showListView = true;
        }else{
          this.showListView = false;
        }
      }
    })
    
    await this.initData(false);

    if(this.Albums == undefined){
      this.noAlbums = true;
    }
  }
  
  

  async initData(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      await this.initAlbums(forceReload);
      resolve("succes");
    })
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
            let isPresent = this.Albums.find((a:any) => a.album.ID == null);
            if (!isPresent) {
              this.Albums.push({album:{ID:null, Name:"Unknown"}, artist:""});
            }
            console.log("Component Data albums",this.Albums);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalAlbumsPresent();
          if( dataPresent == true){
            this.Albums = await this.dexieService.getLoadedLocalAlbums();
            let isPresent = this.Albums.find((a:any) => a.album.ID == null);
            if (!isPresent) {
              this.Albums.push({album:{ID:null, Name:"Unknown"}, artist:""});
            }
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
/*     if (changes.Albums.currentValue != undefined) {
      console.log("Local albums initialized");
   
    } */
  }

  myTrackByFunction(index: number, complexItem: IComplexItem): number {
    return complexItem.album.ID;
  }

  routeAlbumView(albumId: number, title: string){
    this.router.navigate(['/my-music',{outlets: { mymusicContent: ['album', albumId, title] }}]);
  }

} 
