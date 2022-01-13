import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { UiService } from 'src/app/services/component/ui.service';
import { DexieService } from 'src/app/services/indexdDB/dexie.service';

@Component({
  selector: 'app-playlist-tracks',
  templateUrl: './playlist-tracks.component.html',
  styleUrls: ['./playlist-tracks.component.css']
})
export class PlaylistTracksComponent implements OnInit {

  Tracks:any;
  PlaylistTracks: any;
  playlistKey: any = "Playlist";

  showRemoveFromPlaylist:boolean = false;

  constructor(private route: ActivatedRoute, private dexieService:DexieService, private uiService:UiService) {
    this.uiService.onInvokeGetPlaylistTracks().subscribe(async key => await this.getPlaylistTracks(key));
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.playlistKey = params['id'];
      if (this.playlistKey != "Recently Played") {
        this.showRemoveFromPlaylist = true;
      }
      await this.getPlaylistTracks(this.playlistKey);
    });

  }


  async getPlaylistTracks(key:any){
    let idbResp:any[] = await this.dexieService.getPlaylist(key)
    if (idbResp != null) {
      if (key == "Recently Played") {
        idbResp.reverse();
      }
      this.PlaylistTracks =  new TableVirtualScrollDataSource(idbResp);
    }
  }

}
