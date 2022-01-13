import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { UiService } from 'src/app/services/component/ui.service';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';
import { PreviousRouteService } from '../../../services/component/previous-route.service';

declare let ColorThief: any;

@Component({
  selector: 'app-album-view',
  templateUrl: './album-view.component.html',
  styleUrls: ['./album-view.component.css']
})
export class AlbumViewComponent implements OnInit {

  @ViewChild('coverImg') coverImg:ElementRef; 

  Tracks:any;
  AlbumTracks: any;
  albumID: number;
  albumTitle:string = "Album";
  Albums:any;
  AlbumData:any;
  artistName:any = 'Unknown';
  defaultImgURL:any = "../../assets/images/no_album_art.jpg";

  containerGradient:string = "rgb(255, 255, 255)"

  colorThief:any;
  primeColors:any;
  primeColor:any;
  angle:any;
  randomCol1:any;
  randomCol2:any;

  constructor(private route: ActivatedRoute, private previousRouteService: PreviousRouteService, private router: Router, private dexieService:DexieService , private uiService:UiService,) {
    this.colorThief = new ColorThief();
  }

  async ngOnInit() {
    setTimeout(() => {
      this.uiService.changeNavTitle("My Music");
    }, 0);
    this.route.params.subscribe((params: Params) => {
      this.albumID = params['id'];
      this.albumTitle = params['title'];
    });

    await this.initTracks(false);
    this.getAlbumTracks(this.albumID);
    await this.initAlbums(false);
    this.getAlbumData(this.albumID);
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

  getAlbumTracks(albumId:any){

    if (albumId == "null") {
      this.AlbumTracks = this.Tracks.filteredData.filter((track:any) => track.fileMeta.AlbumID == null || track.fileMeta.album.trim().toLowerCase() == "unknown");
    }else{
      this.AlbumTracks = this.Tracks.filteredData.filter((track:any) => track.fileMeta.AlbumID == albumId);
    }

    this.AlbumTracks = new TableVirtualScrollDataSource(this.AlbumTracks);
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

  getAlbumData(albumId:any){
    if (albumId != "null") {
      this.AlbumData = this.Albums.find((data:any) => data.album.ID == albumId);
      if (this.AlbumData.artist != null) {
        this.artistName = this.AlbumData.artist;
      }
      if (this.AlbumData.coverData != null) {
        this.coverImg.nativeElement.src = this.AlbumData.coverData;
        
       
        if (this.coverImg.nativeElement.complete) {
          this.setGradientContainer();
        } else {
          this.coverImg.nativeElement.addEventListener('load', () => {
            this.setGradientContainer();
          });
        }
      }else{
        if (this.coverImg.nativeElement.complete) {
          this.setGradientContainer();
        } else {
          this.coverImg.nativeElement.addEventListener('load', () => {
            this.setGradientContainer();
          });
        }
      }
    }else{
      this.artistName = "";
      if (this.coverImg.nativeElement.complete) {
        this.setGradientContainer();
      } else {
        this.coverImg.nativeElement.addEventListener('load', () => {
          this.setGradientContainer();
        });
      }
    }

  }

  setGradientContainer(){
    this.primeColor = this.colorThief.getColor(this.coverImg.nativeElement);
    this.primeColors = this.colorThief.getPalette(this.coverImg.nativeElement);
    this.angle = Math.round( Math.random() * 360 );
    this.randomCol1 = this.primeColors.splice(Math.floor(Math.random()*this.primeColors.length), 1);
    this.randomCol2 = this.primeColors.splice(Math.floor(Math.random()*this.primeColors.length), 1);

    this.containerGradient = `
    linear-gradient(${this.angle}deg, 
      rgba(${this.primeColor[0]},${this.primeColor[1]}, ${this.primeColor[2]}, 1),
      rgba(${this.randomCol2[0][0]}, ${this.randomCol2[0][1]}, ${this.randomCol2[0][2]}, 1))`
  }

  back(){
    this.router.navigateByUrl(this.previousRouteService.getPreviousUrl())
  }
}
