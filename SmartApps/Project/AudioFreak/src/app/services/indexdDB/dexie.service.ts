import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs'
import { dexie } from '../../dexieDB'; 
import {importDB, exportDB, importInto, peakImportFile} from "dexie-export-import";
import * as FileSaver  from 'file-saver';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { WebWorkerService } from '../webworker/web-worker.service'
import { themeOption } from 'src/app/interfaces/themeOption';
import { UiService } from '../component/ui.service';


@Injectable({
  providedIn: 'root'
})
export class DexieService implements OnInit{

  storage: any;
  targetDirHandle: any;
  localTracks: any;
  localArtists: any;
  localGenres:any;
  localAlbums: any;
  coverObjURL:any[] = [];

  constructor(private webWorkerService:WebWorkerService, private uiService:UiService) { 
    this.storage = dexie;
    console.log("Dexie service constructed")
  }

  async ngOnInit(){}

  async initLocalTracks(){
    return new Promise<string>(async (resolve, reject) =>{
      if (await this.getTargetDirHandle() != null) {
        this.localTracks = new TableVirtualScrollDataSource<audioData>(await this.getAudioFilelinks());
        //this.localTracks = new MatTableDataSource<audioData>(await this.getAudioFilelinks());
        resolve("succes")
      }
      console.log("tracks loaded in service")
    })
  }

  async getLoadedLocalTracks(){
    console.log("getting tracks...")
    return new Promise<string>((resolve, reject) => {
      if (this.localTracks == undefined) {
        this.localTracks = new TableVirtualScrollDataSource();
        resolve(this.localTracks);
      }else{
        resolve(this.localTracks);
      }
    })
  }

  async dataLocalTracksPresent():Promise<boolean> {
    return new Promise<boolean>(async(resolve, reject) => {
      if (await this.getTargetDirHandle() != null) {
        this.localTracks = new TableVirtualScrollDataSource<audioData>(await this.getAudioFilelinks());
        //this.localTracks = new MatTableDataSource<audioData>(await this.getAudioFilelinks());
        if (this.localTracks != undefined) {
          resolve(true)
        }else{
          resolve(false);
        }
      }else{
        this.localTracks = undefined;
        resolve(false);
      }
    })
  }

  async getTargetDirHandle() :Promise<any>{

    let handle = null;

    await this.storage.fileHandles.get('targetDirHandle').then((object :any) => {	
			if (object) {
			  handle = object.value;
			}
		});
    return handle;
  }

  async saveTargetDirHandle(dirHandle:any){
    await this.storage.fileHandles.put({key:"targetDirHandle", value:dirHandle});
  }

  async getCover(ID:number):Promise<any>{
    let coverData = await this.storage.covers.where("ID").equals(ID).first();
    return coverData;
  }

  async getLoadedLocalArtists(){
    console.log("getting artists...")
    return new Promise<string>((resolve, reject) => {
      if (this.localArtists == undefined) {
        resolve(this.localArtists);
      }else{
        resolve(this.localArtists);
      }
    })
  }

  async getLocalArtist(ID:any) :Promise<any>{
    const result = await this.storage.artists.where("ID").equals(ID).first();
    return result;
  }

  async dataLocalArtistsPresent():Promise<boolean>{
    return new Promise<boolean>(async(resolve, reject) => {
      if (await this.getTargetDirHandle() != null) {
        this.localArtists = await this.getLocalArtists();
        if (this.localArtists != undefined) {
          resolve(true)
        }else{
          resolve(false);
        }
      }else{
        this.localArtists = undefined;
        resolve(false);
      }
    })
  }

  async getLoadedLocalGenres(){
    console.log("getting genres...")
    return new Promise<string>((resolve, reject) => {
      if (this.localGenres == undefined) {
        resolve(this.localGenres);
      }else{
        resolve(this.localGenres);
      }
    })
  }

  async dataLocalGenresPresent():Promise<boolean>{
    return new Promise<boolean>(async(resolve, reject) => {
      if (await this.getTargetDirHandle() != null) {
        this.localGenres = await this.getLocalGenres();
        if (this.localGenres != undefined) {
          resolve(true);
        }else{
          resolve(false);
        }
      }else{
        this.localGenres = undefined;
        resolve(false);
      }
    })
  }


  async getLoadedLocalAlbums(){
    console.log("getting albums...")
    return new Promise<string>((resolve, reject) => {
      if (this.localAlbums == undefined) {
        resolve(this.localAlbums);
      }else{
        resolve(this.localAlbums);
      }
    })
  }

  async dataLocalAlbumsPresent():Promise<boolean>{
    return new Promise<boolean>(async(resolve, reject) => {
      if (await this.getTargetDirHandle() != null) {
        this.localAlbums = await this.getLocalAlbumsAndCover();
        if (this.localAlbums != undefined) {
          resolve(true)
        }else{
          resolve(false);
        }
      }else{
        this.localAlbums = undefined;
        resolve(false);
      }
    })
  }

  async getLyric(title:string, artist:string){
    return new Promise<any>(async (resolve, reject) => {
      const result = await this.storage.lyrics.where({
        Title: title,
        Artist: artist
      }).first();
      
      if(result) {
        resolve({res:true, lyrics: result});
      }else{
        resolve({res:false, lyrics: null});
      }
    })
  }

  async getLastFreeLyricID(){
    let lastID = await this.storage.lyrics.orderBy('ID').last();
    if (lastID != undefined) {
      return lastID.ID + 1; 
    }else{
      return 0;
    }
  }


  async saveLyric(title:string, artist:string, text:string){
    return new Promise<any>(async (resolve, reject) => {
      let response = await this.getLyric(title,artist);
      
      if (!response.res) {
        let lastID = await this.getLastFreeLyricID();

        await this.storage.lyrics.add({
          ID:lastID,
          Title: title,
          Artist:artist,
          Text: text
        });

        resolve({res:true, ID: lastID})
      }else{
        resolve({res:false, ID: null});
      }

    })
  }

  async deleteLyric(title:string, artist:string){
    return new Promise<any>(async (resolve, reject) => {
      const result = await this.storage.lyrics.where({
        Title: title,
        Artist: artist
      }).first();
      
      if(result) {
        await this.storage.lyrics.delete(result.ID)
        resolve({res:true});
      }else{
        resolve({res:false});
      }
    })
  }




 /*/////////////////////////////  */
/*      Webworker gebruik        */
/*///////////////////////////// */

  async getAudioFilelinks() :Promise<any[]>{

    return new Promise<any[]>(async (resolve, reject) => {
      let audioLinks :any = [];
      switch (this.webWorkerService.webWorkerSupported) {
        case true:
          audioLinks = await this.webWorkerService.getTracksWithHandle();
          break;
        case false:
          await this.storage.fileLinks.each((f:any) => {
            audioLinks.push(f);
          });
          break;
        default:
          await this.storage.fileLinks.each((f:any) => {
            audioLinks.push(f);
          });
          break;
      }
      resolve(audioLinks);
    })
  }

  async getLocalArtists() :Promise<any[]>{
    let localArtists = [];
    switch (this.webWorkerService.webWorkerSupported) {
      case true:
        localArtists = await this.webWorkerService.getArtists();
        break;
      case false:
        localArtists = await this.storage.artists.toArray();
        break;
      default:
        localArtists = await this.storage.artists.toArray();
        break;
    }
    return localArtists;
  }

  async getLocalGenres() :Promise<any[]>{
    let localGenres = [];
    switch (this.webWorkerService.webWorkerSupported) {
      case true:
        localGenres = await this.webWorkerService.getGenres();
        break;
      case false:
        localGenres = await this.storage.genres.toArray();
        break;
      default:
        localGenres = await this.storage.genres.toArray();
        break;
    }
    return localGenres;
  }


  async getLocalAlbumsAndCover(){
    let albumsWithCover :any = [];

    switch (this.webWorkerService.webWorkerSupported) {
      case true:
        albumsWithCover = await this.webWorkerService.getAlbumsWithCover();
        break;
      case false:
        albumsWithCover = await this.getLocalAlbumsAndCoverDefaultFB();
        break;
      default:
        albumsWithCover = await this.getLocalAlbumsAndCoverDefaultFB();
        break;
    }
    
    return albumsWithCover;
  }

  async getLocalAlbumsAndCoverDefaultFB(){
    let albumsWithCover :any = [];
    for (const item of await this.storage.albums.toArray()) {
    
      let result = {
        album:item,
        artist: null as any,
        coverData: null as any,
      }
  
      if (item.ArtistId != null && item.ArtistId != "null") {
        let artistObj = await this.storage.artists.where("ID").equals(item.ArtistId).first();
        result.artist = artistObj.Name;
      }
  
      if (item.CoverId != null) {
        let coverObj = await this.storage.covers.where("ID").equals(item.CoverId).first();
        const url = URL.createObjectURL(coverObj.coverData);
        result.coverData = url;
      }
  
      albumsWithCover.push(result);
    }

    return albumsWithCover;
  }


/* #region Webworker fallbacks */
  async saveArtist(name:string){
    let response = await this.artistExists(name)
    if (!response.res) {
      let lastID = await this.getLastFreeArtistID();
      await this.storage.artists.add({
        ID:lastID,
        Name: name,
      });
      response.artistId = lastID;
    }
    return response;
  }

  async artistExists(artist:string){

    const result = await this.storage.artists.where("Name").equalsIgnoreCase(artist).first();

  /*     const result = await this.storage.artists.where({
      Name: artist
    }).first(); */
    
    if(result) {
      return {res:true, artistId:result.ID};
    }else{
      return {res:false, artistId: null};
    }
  }

  async getLastFreeArtistID(){
    let lastID = await this.storage.artists.orderBy('ID').last();
    if (lastID != undefined) {
      return lastID.ID + 1; 
    }else{
      return 0;
    }
  }

  async saveGenre(genre:string){
    let response = await this.genreExists(genre)
    if (!response.res) {
      let lastID = await this.getLastFreeGenreID();
      await this.storage.genres.add({
        ID:lastID,
        Genre: genre,
      });
      response.genreId = lastID;
    }
    return response;
  }

  async genreExists(genre:string){

    const result = await this.storage.genres.where("Genre").equalsIgnoreCase(genre).first();
    
    if(result) {
      return {res:true, genreId:result.ID};
    }else{
      return {res:false, genreId: null};
    }
  }

  async getLastFreeGenreID(){
    let lastID = await this.storage.genres.orderBy('ID').last();
    if (lastID != undefined) {
      return lastID.ID + 1; 
    }else{
      return 0;
    }
  }


  async getLastFreeCoverID():Promise<number>{
    let lastID = await this.storage.covers.orderBy('ID').last();
    if (lastID != undefined) {
      return lastID.ID + 1; 
    }else{
      return 0;
    }
  }

  async albumCoverExists(album:string, artist:string){
    const result = await this.storage.covers.where({
      Album: album,
      Artist: artist
    }).first();
    
  /*  const result = await this.storage.covers.where('[Album+Artist]').equals([album, artist]) */
    if(result) {
      return {res:true, coverId:result.ID};
    }else{
      return {res:false, coverId: null};
    }
  }

  async saveCover(id:number,text:string, artist:string ,coverData:any){

    const { data, type } = coverData;
    const byteArray = new Uint8Array(data);
    const blob = new Blob([byteArray], { type });

    await this.storage.covers.add({
      ID:id,
      Album: text,
      Artist:artist,
      coverData: blob
    });
  }

  async saveAlbum(name:string,artistId:any,coverId:number){
    let response = await this.albumExists(name,artistId);
    if (!response.res) {
      let lastID = await this.getLastFreeAlbumID();

      if (artistId == null) {artistId = "null"}

      await this.storage.albums.add({
        ID:lastID,
        Name: name,
        ArtistId:artistId,
        CoverId: coverId
      });
      response.ID = lastID;
    }
    return response;
  }

  async albumExists(album:string, artistId:any):Promise<any>{
    if (artistId == null) {artistId = "null"}

    const result = await this.storage.albums.where({
      Name: album,
      ArtistId: artistId
    }).first();

    if(result) {
      return {res:true, ID:result.ID, Name:result.Name , ArtistId:result.ArtistId, CoverId: result.CoverId};
    }else{
      return {res:false, ID: null};
    }
  }

  async getLastFreeAlbumID():Promise<number>{
    let lastID = await this.storage.albums.orderBy('ID').last();
    if (lastID != undefined) {
      return lastID.ID + 1; 
    }else{
      return 0;
    }
  }

  /////////////////////////////////////////
  async fileRefExist(fileName:string){
    var fileRef = await this.storage.fileLinks
    .where('fileName')
    .equals(fileName)
    .first();

    if(fileRef) {
        return true;
    }else{
      return false;
    }
  }

  async saveAudioFileLink(filename: string,filehandle:any, metadata:any){
    await this.storage.fileLinks.add({
      fileName: filename,
      fileHandle: filehandle,
      fileMeta: metadata
    });
    console.log("fileRef stored");
  }

  /*#region Playback data*/

  async savePlaybackData(key:string, value:any){
     return await this.storage.playbackData.put({key: key, value: value});
  }

  async getPlaybackData(key:string):Promise<any>{
    let response = await this.storage.playbackData.where("key").equals(key).first();
    if(response)
    {return response.value}
    else
    {return null}
  }

  /*#endregion*/

 

/*#region Playlist*/
    async savePlaylist(key:string, value:any){
      await this.storage.playlists.put({key: key, value: value});
    }

    async deletePlaylist(key:string){
      await this.storage.playlists.delete(key);
    }

    async saveMultiplePlaylist(playlists:any[]){
      await this.storage.playlists.bulkPut(playlists).then(function() {
        console.log("Playlists initialised");
      }).catch(function (e:any) {
          console.error (e);
      });
    }
  
    async getPlaylist(key:string):Promise<any>{
      let response = await this.storage.playlists.where("key").equals(key).first();
      if(response)
      {return response.value}
      else
      {return null}
    }

    async getAllPlaylists(){
      return await this.storage.playlists.toArray();
    }

    async saveToPlaylist(key:any, track:any, forceTolast:boolean = false){
      let succes = false;
      let res = await this.getPlaylist(key);
      if (res != null) {
        let resp = res.find( (t:any) => t.fileName == track.fileName);
        if (resp == undefined) {
          res.push(track);
          await this.savePlaylist(key,res);
          succes = true;
        }else{
          if (forceTolast == true) {
            let resp = res.find( (t:any) => t.fileName == track.fileName);
            let respIndex = res.indexOf(resp);
            if (respIndex > -1) {
              res.splice(respIndex, 1);
              res.push(track);
              await this.savePlaylist(key,res);
            }
            succes = true;
          }else{
            succes = false;
          }
        }
      }
      return succes;
    }

    async removeFromPlaylist(key:any, track:any){
      let res:any[] = await this.getPlaylist(key);
      if (res != null) {
        let resp = res.find( (t:any) => t.fileName == track.fileName);
        let respIndex = res.indexOf(resp);
        if (respIndex > -1) {
          res.splice(respIndex, 1);
          await this.savePlaylist(key,res);
        }
      }
    }
    
   /*#endregion*/

  /*#region Settings Region*/
  async saveSetting(key:string, value:any){
    await this.storage.settings.put({key: key, value: value});
  }

  async getSetting(key:string):Promise<any>{
    let response = await this.storage.settings.where("key").equals(key).first();
    if(response)
    {return response.value}
    else
    {return null}
  }
  
 /*#endregion*/
 async clearCache(forceDataReload:boolean = false, notifyClearCache:boolean = false){
  await this.storage.fileHandles.clear();
  await this.storage.fileLinks.clear();
  await this.storage.covers.clear();
  await this.storage.artists.clear();
  await this.storage.albums.clear();
  await this.storage.genres.clear();
  await this.storage.lyrics.clear();
  await this.storage.playlists.clear();
  await this.storage.playbackData.clear();
  await this.storage.settings.clear();
  if (notifyClearCache == true) {
    await this.uiService.cacheClearedNotify();
  }
  if (forceDataReload == true) {
    await this.uiService.invokeInitMyMusicData();
  }
}
/* #endregion */

  ///////////////////////////////////////////
  async exportIDBData(){
    const blob = await exportDB(this.storage);
    console.log("EXPORTING",blob);
    await FileSaver.saveAs(blob, "idb-storage.json");
    console.log("Data Exported");
  }

  async importIDBData(blobFile:any){
    console.log("IMPORTING",blobFile);
    await importInto(this.storage, blobFile);
    console.log("Data Imported");
  }
}


export interface audioData {
  fileHandle: any;
  fileMeta: any;
  fileName: string;
}