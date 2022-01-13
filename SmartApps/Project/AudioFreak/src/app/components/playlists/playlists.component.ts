import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/component/ui.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {


  constructor(private uiService:UiService) { }

  async ngOnInit(){
    setTimeout(() => {
      this.uiService.changeNavTitle("Playlists");
    }, 0);
  }
}


