import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { YoutubeService } from '../../../../services/API/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UiService } from '../../../../services/component/ui.service';
export interface vidData{
  vidId:string;
  thumbnail:string;
  channel:string;
  vidTitle:string;
}

@Component({
  selector: 'app-youtube-tab',
  templateUrl: './youtube-tab.component.html',
  styleUrls: ['./youtube-tab.component.css']
})
export class YoutubeTabComponent implements OnInit {

  search = new FormControl('');
  value:string="";
  video:string="";
  htmlString:string="";
  pageToken:string="";
  vidArr:vidData[]=[];

  constructor(private http:YoutubeService, private domSanitizer: DomSanitizer, private uiService: UiService) { }

  ngOnInit(): void {
  }
  nextSearch(){
    
    this.http.getVideos(this.search.value,this.pageToken).subscribe((data) => {
      this.pageToken = data.nextPageToken;
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        const vid:vidData = {
          vidId: item.id.videoId,
          thumbnail:item.snippet.thumbnails.high.url,
          vidTitle: item.snippet.title,
          channel: item.snippet.channelTitle
        }
        this.vidArr.push(vid);
      }
    });
  }



 videoSearch() {
       this.vidArr = []; //reset search

  this.http.getVideos(this.search.value,).subscribe((data) => {
    this.pageToken = data.nextPageToken;
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const vid:vidData = {
        vidId: item.id.videoId,
        thumbnail:item.snippet.thumbnails.high.url,
        vidTitle: item.snippet.title,
        channel: item.snippet.channelTitle
      }
      this.vidArr.push(vid);
      }
    });
  }

  dangerousVideoUrl:string="";
  videoUrl:SafeResourceUrl="";

  onClick(id:string){
    this.dangerousVideoUrl = 'https://www.youtube-nocookie.com/embed/' + id +"?controls=1&autoplay=1";
   /*  this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl); */
    this.uiService.togglePiPStatus({ID: this.dangerousVideoUrl});
  }

}
