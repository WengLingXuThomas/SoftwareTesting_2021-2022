import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

@Component({
  selector: 'app-genres-tab',
  templateUrl: './genres-tab.component.html',
  styleUrls: ['./genres-tab.component.css']
})
export class GenresTabComponent implements OnInit {

  @Input() Genres: any;

  noGenres:boolean = false;

  constructor(private dexieService:DexieService, private router: Router) { }

  async ngOnInit(){
    await this.initData(false);

    if(this.Genres == undefined){
      this.noGenres = true;
    }
  }

  async initData(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      await this.initGenres(forceReload);
      resolve("succes");
    })
  }

  async initGenres(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      switch (forceReload) {
        case false:
          this.Genres = await this.dexieService.getLoadedLocalGenres();
          if(this.Genres == undefined){
            let dataPresent = await this.dexieService.dataLocalGenresPresent();
            if( dataPresent == true){
              this.initGenres(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            let isPresent = this.Genres.find((g:any) => g.ID == null);
            if (!isPresent) {
              this.Genres.push({ID:null, Genre:"Unknown"});
            }
            console.log("Component Data genres",this.Genres);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalGenresPresent();
          if( dataPresent == true){
            this.Genres = await this.dexieService.getLoadedLocalGenres();
            let isPresent = this.Genres.find((g:any) => g.ID == null);
            if (!isPresent) {
              this.Genres.push({ID:null, Genre:"Unknown"});
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

  routeGenreView(genreID:number, genre:string){
    this.router.navigate(['/my-music',{outlets: { mymusicContent: ['genre', genreID, genre] }}]);
  }



}
