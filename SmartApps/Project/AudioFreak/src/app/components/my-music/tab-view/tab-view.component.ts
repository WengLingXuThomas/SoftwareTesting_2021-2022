import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { UiService } from '../../../services/component/ui.service';
import { DexieService } from '../../../services/indexdDB/dexie.service'
import { Subscription } from 'rxjs';

import {TabItem} from '../../../interfaces/TabItem.interface'
import { MatTabNav } from '@angular/material/tabs';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.css']
})
export class TabViewComponent implements OnInit {
  
  localTracks: any;
  localArtists: any;
  localAlbums:any;
  localGenres:any;

  tabs:TabItem[] = [
    {
      label:"Tracks",
      route:"tracks-tab"
    },
    {
      label:"Artists",
      route:"artists-tab"
    },
    {
      label:"Albums",
      route:"albums-tab"
    },
    {
      label:"Genres",
      route:"genres-tab"
    }
  ];

  @ViewChild('mattabnav') navtab:MatTabNav;

  activeLink = this.tabs[0];

  reInitDataSubscription:Subscription;

  constructor(private uiService:UiService, private dexieService:DexieService, private router:Router) {
    this.reInitDataSubscription = this.uiService.onInvokeInitMyMusicData().subscribe(async () => await this.initData(true));
  }

  async ngOnInit(){
    setTimeout(() => {
      this.uiService.changeNavTitle("My Music");
    }, 0);

    await this.initTabOrder();

    switch (this.router.url) {
      case "/my-music/(mymusicContent:musictabs/(mytabs:tracks-tab))":
        this.activeLink = this.tabs.find(t => t.label == 'Tracks');
        break;
      case "/my-music/(mymusicContent:musictabs/(mytabs:artists-tab))":
        this.activeLink = this.tabs.find(t => t.label == 'Artists');
        break;
      case "/my-music/(mymusicContent:musictabs/(mytabs:albums-tab))":
        this.activeLink = this.tabs.find(t => t.label == 'Albums');
        break;
      case "/my-music/(mymusicContent:musictabs/(mytabs:genres-tab))":
        this.activeLink = this.tabs.find(t => t.label == 'Genres');
        break;
      default:
        this.activeLink = this.tabs[0];
        break;
    }

    if (this.activeLink == undefined) {
      this.reRoute();
    }

    //await this.initData(false);
  }

  reRoute(){
    switch (this.tabs[0].label) {
      case "Tracks":
        this.router.navigateByUrl('/my-music/(mymusicContent:musictabs/(mytabs:tracks-tab))');
        break;
      case "Artists":
        this.router.navigateByUrl('/my-music/(mymusicContent:musictabs/(mytabs:artists-tab))');
        break;
      case "Albums":
        this.router.navigateByUrl('/my-music/(mymusicContent:musictabs/(mytabs:albums-tab))');
        break;
      case "Genres":
        this.router.navigateByUrl('/my-music/(mymusicContent:musictabs/(mytabs:genres-tab))');
        break;
    
      default:
        this.router.navigateByUrl('/my-music/(mymusicContent:musictabs/(mytabs:tracks-tab))');
        break;
    }

    this.activeLink = this.tabs[0];
  }


  async initTabOrder(){
    const DBTabs = await this.dexieService.getSetting('tabs');

    if (DBTabs) {
      this.tabs = []
      for (const tab of DBTabs) {
        switch (tab.name) {
          case "Tracks":
            if (tab.enabled) {
              this.tabs.push({
                label:"Tracks",
                route:"tracks-tab"
              })
            }
          break;
          case "Artists":
            if (tab.enabled) {
              this.tabs.push({
                label:"Artists",
                route:"artists-tab"
              })
            }
          break;
          case "Albums":
            if (tab.enabled) {
              this.tabs.push({
                label:"Albums",
                route:"albums-tab"
              })
            }    
          break;
          case "Genres":
            if (tab.enabled) {
              this.tabs.push({
                label:"Genres",
                route:"genres-tab"
              })
            }
          break;
        }
      }
    }

  }

  async initData(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      await this.initTracks(forceReload);
      await this.initArtists(forceReload);
      await this.initAlbums(forceReload);
      await this.initGenres(forceReload);
      resolve("succes");
    })
  }

  async initTracks(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      switch (forceReload) {
        case false:
          this.localTracks = await this.dexieService.getLoadedLocalTracks();
          if(this.localTracks.filteredData.length == 0){
            let dataPresent = await this.dexieService.dataLocalTracksPresent();
            if( dataPresent == true){
              this.initTracks(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            console.log("Component Data tracks",this.localTracks);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalTracksPresent();
          if( dataPresent == true){
            this.localTracks = await this.dexieService.getLoadedLocalTracks();
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
          this.localArtists = await this.dexieService.getLoadedLocalArtists();
          if(this.localArtists == undefined){
            let dataPresent = await this.dexieService.dataLocalArtistsPresent();
            if( dataPresent == true){
              this.initArtists(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            console.log("Component Data artists",this.localArtists);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalArtistsPresent();
          if( dataPresent == true){
            this.localArtists = await this.dexieService.getLoadedLocalArtists();
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
          this.localAlbums = await this.dexieService.getLoadedLocalAlbums();
          if(this.localAlbums == undefined){
            let dataPresent = await this.dexieService.dataLocalAlbumsPresent();
            if( dataPresent == true){
              this.initAlbums(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            console.log("Component Data albums",this.localAlbums);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalAlbumsPresent();
          if( dataPresent == true){
            this.localAlbums = await this.dexieService.getLoadedLocalAlbums();
            console.log("retrieving data");
          }else{
            console.log("no data to retrieve");
          }  
          break;
      }

      resolve("succes");
    })
  }

  async initGenres(forceReload:boolean){
    return new Promise(async (resolve, reject) => {
      switch (forceReload) {
        case false:
          this.localGenres = await this.dexieService.getLoadedLocalGenres();
          if(this.localGenres == undefined){
            let dataPresent = await this.dexieService.dataLocalGenresPresent();
            if( dataPresent == true){
              this.initGenres(false);
              console.log("retrieving data");
            }else{
              console.log("no data to retrieve");
            }     
          }else{
            let isPresent = this.localGenres.find((g:any) => g.ID == null);
            if (!isPresent) {
              this.localGenres.push({ID:null, Genre:"Unknown"});
            }
            console.log("Component Data genres",this.localGenres);
          }
          break;
        case true:
          let dataPresent = await this.dexieService.dataLocalGenresPresent();
          if( dataPresent == true){
            this.localGenres = await this.dexieService.getLoadedLocalGenres();
            let isPresent = this.localGenres.find((g:any) => g.ID == null);
            if (!isPresent) {
              this.localGenres.push({ID:null, Genre:"Unknown"});
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


  /*  TESTING PURPOSE dont touch */
  /* async onDownloadIDBData(){
    await this.dexieService.exportIDBData();
  }

  async onFileSelected(e:any) {
    var file = await e.target.files[0];
    await this.dexieService.importIDBData(file);
  } */
}
