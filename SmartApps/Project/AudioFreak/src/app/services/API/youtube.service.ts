import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyDtbAV_Hz-o_YXlUnBy1eZ0Yj_9xZ1Z-Ug&type=video&maxResults=10';
  constructor(private http: HttpClient) { }
  
  getVideos(searchTerm:string,pageToken?:string): Observable<any> {
    let url
    if(pageToken == undefined){
      url = `${this.apiUrl}&q=${searchTerm}`;
    }else{
      url = `${this.apiUrl}&pageToken=${pageToken}&q=${searchTerm}`;
    }
    console.log(url)
    return this.http.get<any>(url)
  }

}
