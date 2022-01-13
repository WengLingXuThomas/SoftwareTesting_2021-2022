import { Injectable } from '@angular/core';
import { DexieService } from '../indexdDB/dexie.service'

declare const jsmediatags:any;

@Injectable({
  providedIn: 'root'
})
export class AudioMetadataService {

  freeID:number;
  coverCheckResp:any;
  constructor(private dexie: DexieService) {}

  /* #region Enkel gebruikt als FALLBACKS indien Webworkers niet ondersteunt  */
   async getMetaData(blobFile:any, filename:string):Promise<any>{
    return new Promise( (resolve, reject) =>{
      let metaData:any = "";
      jsmediatags.read(blobFile, {
        onSuccess: async (tag:any) => {
          metaData = tag;
          resolve(await this.retrieveData(blobFile,filename,metaData));
        },
        onError: (error:any) =>{
          console.log(':(', error.type, error.info, filename);
          resolve({
            "title":filename.substring(0, filename.length-4),
            "artist":"Unknown",
            "album":"Unknown",
            "genre":"Unknown",
            "picture":null,
          });
        }
      });
    })
  }
  
  private async retrieveData(blobFile:any, filename:string, metaData:any){
    let generalMetaData:MetaData = {
      "title":filename.substring(0, filename.length-4),
      "artist":"Unknown",
      "album":"Unknown",
      "genre":"Unknown",
      "ArtistID":null,
      "AlbumID":null,
      "CoverID":null,
      "GenreID":null
    }

    if (metaData.type == "ID3" || metaData.type == "MP4" || metaData.type == "M4A" || metaData.type == "FLAC") {
      generalMetaData.title = metaData.tags.title != undefined && metaData.tags.title != "" ? metaData.tags.title : filename.substring(0, filename.length-4);
      generalMetaData.artist = metaData.tags.artist != undefined && metaData.tags.artist != "" ? metaData.tags.artist?.trim() : "Unknown";
      generalMetaData.album = metaData.tags.album != undefined && metaData.tags.album != "" ? metaData.tags.album : "Unknown";
      generalMetaData.genre = metaData.tags.genre != undefined && metaData.tags.genre != "" && metaData.tags.genre != " " && metaData.tags.genre.trim().toLowerCase() != "unknown" ? metaData.tags.genre : "Unknown";

      if (metaData.tags.artist) {
        let artistId = await this.dexie.saveArtist(metaData.tags.artist?.trim());
        if (!artistId.res) {
          generalMetaData.ArtistID = artistId.artistId;
        }else{
          generalMetaData.ArtistID = artistId.artistId;
        }
      }

      if (metaData.tags.genre) {
        if (metaData.tags.genre != " " && metaData.tags.genre.trim().toLowerCase() != "unknown"){
          let genre = await this.dexie.saveGenre(metaData.tags.genre);
          if (!genre.res) {
            generalMetaData.GenreID = genre.genreId;
          }else{
            generalMetaData.GenreID = genre.genreId;
          }
        }
      }


      if (metaData.tags.picture) {
        this.freeID = null;
        this.coverCheckResp = null;
        this.freeID = await this.dexie.getLastFreeCoverID();
        if (metaData.tags.album) {
          this.coverCheckResp = await this.dexie.albumCoverExists(generalMetaData.album, metaData.tags.artist);
          if (!this.coverCheckResp.res) {
            console.log('%c picture album ', 'background: #222; color: #bada55');
            await this.dexie.saveCover(this.freeID, metaData.tags.album,metaData.tags.artist,metaData.tags.picture)
            generalMetaData.CoverID = this.freeID;
          }else{
            generalMetaData.CoverID = this.coverCheckResp.coverId;
          }
        }else{
          if (metaData.tags.artist) {
            this.coverCheckResp = await this.dexie.albumCoverExists(filename,metaData.tags.artist);
            if (!this.coverCheckResp.res) {
              console.log('%c picture no album ', 'background: #222; color: #FF0000');
              await this.dexie.saveCover(this.freeID,filename,metaData.tags.artist,metaData.tags.picture)
              generalMetaData.CoverID = this.freeID;
            }else{
              generalMetaData.CoverID = this.coverCheckResp.coverId;
            }
          }else{
            this.coverCheckResp = await this.dexie.albumCoverExists(filename,"Unknown");
            if (!this.coverCheckResp.res) {
              console.log('%c picture no album no Artist ', 'background: #222; color: #0000FF');
              await this.dexie.saveCover(this.freeID,filename,metaData.tags.artist,metaData.tags.picture)
              generalMetaData.CoverID = this.freeID;
            }else{
              generalMetaData.CoverID = this.coverCheckResp.coverId;
            }
          }
        }      
      }

      if (metaData.tags.album) {
        let albumId = await this.dexie.saveAlbum(metaData.tags.album,generalMetaData.ArtistID, generalMetaData.CoverID );
        if(!albumId.res) {
          generalMetaData.AlbumID = albumId.ID;
        }else{
          generalMetaData.AlbumID = albumId.ID;
        }
      }
      //generalMetaData.picture = metaData.tags.picture != undefined ? metaData.tags.picture : null;
    }
    return generalMetaData;
  }
  /* #endregion */

}

export interface MetaData {
  "title":string,
  "artist":string,
  "album": string,
  "genre": string,
  "ArtistID":any,
  "AlbumID":any,
  "CoverID":any;
  "GenreID":any;
}