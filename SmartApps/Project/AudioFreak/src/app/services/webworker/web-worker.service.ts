import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebWorkerService {

  webWorkerSupported:boolean = true;
  mainWorker:any;
  fileWorker:any;

  constructor() {
    this.initializeWorker();
  }

  initializeWorker(){
    if (typeof Worker !== 'undefined') {
      this.webWorkerSupported = true;
      console.log("Web workers supported 🎉")
      if (!this.mainWorker) {
        // Create a new
        this.mainWorker = new Worker(new URL('../../webworkers/app.worker', import.meta.url));
        this.fileWorker = new Worker(new URL('../../webworkers/file.worker', import.meta.url));
      }
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      this.webWorkerSupported = false;
      console.log("Web workers not supported 💩")
    }
  }

  indexLocalFiles(){
    this.mainWorker.postMessage({action: "index", data: "indexData"} );

    this.mainWorker.onmessage = ({ data }:any) => {
      console.log(`%c indexLocalFiles() response ${data}`, 'background: #222; color: blue');
    };
  }

  async getTracksWithHandle():Promise<any[]>{
    return new Promise((resolve, reject) => {
      this.mainWorker.postMessage({action: "getTracksWithHandle", data: null});
      this.mainWorker.onmessage = ({ data }:any) => {
        if (data.sourceWorker == "mainWorker") {
          resolve(data.response);
        }
      };
    });
  }

  async getArtists():Promise<any[]>{
    return new Promise((resolve, reject) => {
      this.mainWorker.postMessage({action: "getArtists", data: null});
      this.mainWorker.onmessage = ({ data }:any) => {
        if (data.sourceWorker == "mainWorker") {
          resolve(data.response);
        }
      };
    });
  }

  async getGenres():Promise<any[]>{
    return new Promise((resolve, reject) => {
      this.mainWorker.postMessage({action: "getGenres", data: null});
      this.mainWorker.onmessage = ({ data }:any) => {
        if (data.sourceWorker == "mainWorker") {
          resolve(data.response);
        }
      };
    });
  }

  async getAlbumsWithCover():Promise<any[]>{
    return new Promise((resolve, reject) => {
      this.mainWorker.postMessage({action: "getAlbumsWithCover", data: null});
      this.mainWorker.onmessage = ({ data }:any) => {
        if (data.sourceWorker == "mainWorker") {
          resolve(data.response);
        }
      };
    });
  }

  async saveFileReferences(dirHandle:any):Promise<any>{
    return new Promise((resolve, reject) => {
      this.fileWorker.postMessage({action: "saveFileReferences", data: dirHandle});
      this.fileWorker.onmessage = ({ data }:any) => {
        if (data.sourceWorker == "fileWorker") {
          resolve(data.response);
        }
      };
    })
  }

}

export interface wwMessage {
  action:string;
  data:any;
} 

