import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { PreviousRouteService } from 'src/app/services/component/previous-route.service';
import { UiService } from 'src/app/services/component/ui.service';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';
import { isTouchDevice } from '../tab-view/tracks-tab/tracks-tab.component';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit, AfterContentChecked {

  searchTerm:string;
  Tracks:any;
  Artists: any;
  Albums: any;
  defaultImgURL:any = "../../assets/images/no_album_art.jpg";
  showTracks: boolean = false;
  showCarousel:boolean = false;
  showArtists:boolean = false;

  tracksResultCount:number;
  artistResultCount:number;

  noResults:boolean = false;
  onTouchDevice:any = true; 


  constructor(private uiService:UiService ,  private cdref: ChangeDetectorRef,private router: Router, private previousRouteService: PreviousRouteService, private dexieService:DexieService, private route: ActivatedRoute) {
    this.onTouchDevice = isTouchDevice();
  }

  ngAfterContentChecked() {
    //Prevent [ExpressionChangedAfterItHasBeenCheckedError]
    this.cdref.detectChanges();
  }

  async ngOnInit() {
    setTimeout(() => {
      this.uiService.changeNavTitle("My Music");
    }, 0);

    this.route.params.subscribe(async (params: Params) => {
      this.searchTerm = params['term'];
      if (this.Tracks == undefined) {
        await this.initData(false);
      }
      
      if (this.Tracks.filteredData.length == 0) return;
      await this.searchResults(this.searchTerm);
    });
    
    //await this.initData(false);
  }

  async initData(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      await this.initTracks(forceReload);
      await this.initArtists(forceReload);
      await this.initAlbums(forceReload);
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
  async initArtists(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      switch (forceReload) {
        case false:
          this.Artists = await this.dexieService.getLoadedLocalArtists();
          if(this.Artists == undefined){
            let dataPresent = await this.dexieService.dataLocalArtistsPresent();
            if( dataPresent == true){
              this.initArtists(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            let isPresent = this.Artists.find((a:any) => a.ID == null);
            if (!isPresent) {
              this.Artists.push({ID:null, Name:"Unknown"});
            }
            console.log("Component Data artists",this.Artists);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalArtistsPresent();
          if( dataPresent == true){
            this.Artists = await this.dexieService.getLoadedLocalArtists();
            let isPresent = this.Artists.find((a:any) => a.ID == null);
            if (!isPresent) {
              this.Artists.push({ID:null, Name:"Unknown"});
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

  tracksResults: any = [];
  artistResults: any[] = [];
  albumResults: any[] = [];

  tracksTableFormat: TableVirtualScrollDataSource<any> = new TableVirtualScrollDataSource();


  async searchResults(term:string){
    this.clearPreviousResults();

    for (const track of this.Tracks.filteredData) {
      if (track.fileMeta.title.trim().toLowerCase().includes(term.toLowerCase())) {
        this.tracksResults.push(track);
      }
    }

    this.tracksResults =  new TableVirtualScrollDataSource(this.tracksResults);

    for (const artist of this.Artists) {
      if (artist.Name.trim().toLowerCase().includes(term.toLowerCase())) {
        this.artistResults.push(artist);
      }
    }

    for (const album of this.Albums) {
      if (album.album.Name.trim().toLowerCase().includes(term.toLowerCase())) {
        this.albumResults.push(album);
      }
    }

    if (this.tracksResults.filteredData.length > 0) {
      this.showTracks = true;
      this.tracksResultCount = this.tracksResults.filteredData.length;
    }else{
      this.showTracks = false;
    }

    if (this.albumResults.length > 0) {
      this.showCarousel = true;
    }else{
      this.showCarousel = false;
    }
    
    if (this.artistResults.length > 0) {
      this.showArtists = true;
      this.artistResultCount = this.artistResults.length;
    }else{
      this.showArtists = false;
    }


    if (this.tracksResults.filteredData.length == 0 && this.albumResults.length == 0 && this.artistResults.length == 0) {
      this.noResults = true;
    }else{
      this.noResults = false;
    }


    console.log("Tracks:",this.tracksResults);
    console.log("Artist:",this.artistResults);
    console.log("Album",this.albumResults);
  }

  clearPreviousResults(){
    this.tracksResults = [];
    this.artistResults = [];
    this.albumResults = [];
    this.tracksResultCount = null;
    this.artistResultCount = null;
  }

  routeAlbumView(albumId: number, title: string){
    this.router.navigate(['/my-music',{outlets: { mymusicContent: ['album', albumId, title] }}]);
  }

  routeArtistView(artistID:number, artistName:string){
    this.router.navigate(['/my-music',{outlets: { mymusicContent: ['artist', artistID, artistName] }}]);
  }

  back(){
    this.router.navigateByUrl(this.previousRouteService.getPreviousUrl())
  }

}
