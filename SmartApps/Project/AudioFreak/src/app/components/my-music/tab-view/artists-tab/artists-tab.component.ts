import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

@Component({
  selector: 'app-artists-tab',
  templateUrl: './artists-tab.component.html',
  styleUrls: ['./artists-tab.component.css']
})
export class ArtistsTabComponent implements OnInit, OnChanges {

  @ViewChildren('expPanel') panels:QueryList<MatExpansionPanel>;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input() Artists: any;
  Alfabet: Array<string> = ['&','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

  constructor(private dexieService:DexieService, private router: Router) { }

  async ngOnInit(){
    await this.initData(false);
    if (this.Artists != undefined) {
      this.accordion.openAll();
    }
  }

  async initData(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      await this.initArtists(forceReload);
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.Artists.currentValue != undefined) {
/*       console.log("Local artists initialized");
      this.Artists.push({ID:null, Name:"Unknown"}); */
    }
  }

  //Vraagt bij oproeping een letter, die dan gebruikt wordt om een array terug te sturen met alle songs die dat letter als start waarde heeft
  orderArtists(letter: any)  {
    let result:any = [];

    for (let i = 0; i < this.Artists.length; i++) {
      let firstChar = this.checkLetter(this.Artists[i].Name.trim());

      if (letter == "&") {
        if (!(/[a-zA-Z]/).test(firstChar)) {
          result.push(this.Artists[i]);
        }
      }else{
        if(firstChar == letter){
          result.push(this.Artists[i])
        }
      }
    }

    return result;
  }

  //Vraagt een woord op die dan de eerste letter terug geeft
  checkLetter(word: any){
    let x = word.charAt(0)
    //console.log(x);
    return x
  }

  routeArtistView(artistID:number, artistName:string){
    this.router.navigate(['/my-music',{outlets: { mymusicContent: ['artist', artistID, artistName] }}]);
  }

  async scrollTo(panelID:string){
    let panel = await this.panels.find((panel:any) => panel.__ngContext__[28] == panelID);
    if (panel.expanded == true) {
      document.getElementById(panelID).scrollIntoView({ behavior: 'smooth' });
    }else{
      let subscription = panel.afterExpand.subscribe(() => {
        document.getElementById(panelID).scrollIntoView({ behavior: 'smooth' });
        subscription.unsubscribe();
      })
      panel.open();
    }
  }
}
