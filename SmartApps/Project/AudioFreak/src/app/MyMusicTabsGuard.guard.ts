import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import {DexieService} from './services/indexdDB/dexie.service'

@Injectable()
export class MyMusicTabsGuard implements CanActivate  {


  constructor(private router: Router, private dexieService:DexieService) { }

  async canActivate(){
    const tabs = await this.dexieService.getSetting('tabs');
    if (tabs) {
        switch (tabs[0].name) {
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
    }else{
        this.router.navigateByUrl('/my-music/(mymusicContent:musictabs/(mytabs:tracks-tab))');
    }

    return false
  }
}
