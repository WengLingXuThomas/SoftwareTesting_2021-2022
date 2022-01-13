import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { UiService } from 'src/app/services/component/ui.service';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

@Component({
  selector: 'app-genre-view',
  templateUrl: './genre-view.component.html',
  styleUrls: ['./genre-view.component.css']
})
export class GenreViewComponent implements OnInit {

  Tracks:any;
  GenreTracks: any;
  genreID: number;
  genre:string = "Genre";

  constructor(private route: ActivatedRoute, private router: Router, private dexieService:DexieService, private uiService:UiService) { }

  async ngOnInit() {
    setTimeout(() => {
      this.uiService.changeNavTitle("My Music");
    }, 0);

    this.route.params.subscribe((params: Params) => {
      this.genreID = params['id'];
      this.genre = params['genre'];
    });

    await this.initTracks(false);
    this.getGenreTracks(this.genreID);
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

  getGenreTracks(genreID:any){
    if (genreID == "null") {
      this.GenreTracks = this.Tracks.filteredData.filter((track:any) => track.fileMeta.GenreID == null || track.fileMeta.genre.trim().toLowerCase() == "unknown");
    }else{
      this.GenreTracks = this.Tracks.filteredData.filter((track:any) => track.fileMeta.GenreID == genreID);
    }

    this.GenreTracks = new TableVirtualScrollDataSource(this.GenreTracks);
  }

}
