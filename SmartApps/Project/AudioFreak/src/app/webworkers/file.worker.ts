import * as jsmediatags from 'jsmediatags';
import { dexie } from '../../app/dexieDB';
import {saveArtist, getLastFreeCoverID, albumCoverExists, saveCover, saveAlbum, saveGenre} from './app.worker'

/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
    let response = null;
  
    switch (data.action) {
      case "saveFileReferences":
        response = await saveFileReferences(data.data);
        break;
    }
    
    postMessage({sourceWorker:"fileWorker", response:response});
});

let freeID:number;
let coverCheckResp:any;

async function saveFileReferences(dirHandle:any){
  try {
    await recursiveDirReaderFileRefSaver(dirHandle);
  } catch (error:any) {
    console.log(error)
  }
  return "All file references saved";
}

async function recursiveDirReaderFileRefSaver(dirHandle:any){
  try {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file" && (entry.name.endsWith(".mp3") || entry.name.endsWith(".m4a") || entry.name.endsWith(".flac"))) {
        let fileExists = await fileRefExist(entry.name)
        if (!fileExists) {
          const file = await entry.getFile();
          const metaData = await decodeMetadata(file, entry.name)
          await saveAudioFileLink(entry.name, entry, metaData);
        }
      }else if (entry.kind === "directory") {
        const newHandle = await dirHandle.getDirectoryHandle(entry.name);
        await recursiveDirReaderFileRefSaver(newHandle);
      }
    }
  } catch (error:any) {
    console.log(error)
    if (error.name == "NotAllowedError") {
      console.log(`%cAudioFreak needs permission to read ${dirHandle.name} directory`, "color:red");
    }
  }
} 

async function fileRefExist(fileName:string){
  var fileRef = await dexie.table("fileLinks")
  .where('fileName')
  .equals(fileName)
  .first();

  if(fileRef) {
      return true;
  }else{
    return false;
  }
}

async function saveAudioFileLink(filename: string,filehandle:any, metadata:any){
  await dexie.table("fileLinks").add({
    fileName: filename,
    fileHandle: filehandle,
    fileMeta: metadata
  });
  console.log("fileRef stored");
}

async function decodeMetadata(blobFile:any, filename:string){

  return new Promise((resolve, reject) => {

      let metaData:any = "";

      jsmediatags.read(blobFile, {
          onSuccess: async (tag:any) => {
          metaData = tag;
          resolve(await retrieveData(blobFile,filename,metaData));
          },
          onError: (error:any) =>{
          //console.log(':(', error.type, error.info, filename);
          resolve({
              "title":filename.substring(0, filename.length-4),
              "artist":"Unknown",
              "album":"Unknown",
              "genre":"Unknown",
              "picture":null,
          });
      }
    });
  });
}

async function retrieveData(blobFile:any, filename:string, metaData:any){ 
  let generalMetaData:MetaData = {
      "title":filename.substring(0, filename.length-4),
      "artist":"Unknown",
      "album":"Unknown",
      "genre":"Unknown",
      "ArtistID":null,
      "AlbumID":null,
      "CoverID":null,
      "GenreID":null,
    }

    if (metaData.type == "ID3" || metaData.type == "MP4" || metaData.type == "M4A" || metaData.type == "FLAC") {
      generalMetaData.title = metaData.tags.title != undefined && metaData.tags.title != "" ? metaData.tags.title : filename.substring(0, filename.length-4);
      generalMetaData.artist = metaData.tags.artist != undefined && metaData.tags.artist != "" ? metaData.tags.artist?.trim() : "Unknown";
      generalMetaData.album = metaData.tags.album != undefined && metaData.tags.album != "" ? metaData.tags.album : "Unknown";
      generalMetaData.genre = metaData.tags.genre != undefined && metaData.tags.genre != "" && metaData.tags.genre != " " && metaData.tags.genre.trim().toLowerCase() != "unknown" ? metaData.tags.genre : "Unknown";

      if (metaData.tags.artist) {
        let artistId = await saveArtist(metaData.tags.artist?.trim());
        if (!artistId.res) {
          generalMetaData.ArtistID = artistId.artistId;
        }else{
          generalMetaData.ArtistID = artistId.artistId;
        }
      }

      if (metaData.tags.genre) {
        if (metaData.tags.genre != " " && metaData.tags.genre.trim().toLowerCase() != "unknown") {
          let genre = await saveGenre(metaData.tags.genre);
          if (!genre.res) {
            generalMetaData.GenreID = genre.genreId;
          }else{
            generalMetaData.GenreID = genre.genreId;
          }
        }
      }

      if (metaData.tags.picture) {
        freeID = null;
        coverCheckResp = null;
        freeID = await getLastFreeCoverID();
        if (metaData.tags.album) {
          coverCheckResp = await albumCoverExists(generalMetaData.album, metaData.tags.artist);
          if (!coverCheckResp.res) {
            console.log('%c picture album ', 'background: #222; color: #bada55');
            await saveCover(freeID, metaData.tags.album,metaData.tags.artist,metaData.tags.picture)
            generalMetaData.CoverID = freeID;
          }else{
            generalMetaData.CoverID = coverCheckResp.coverId;
          }
        }else{
          if (metaData.tags.artist) {
            coverCheckResp = await albumCoverExists(filename,metaData.tags.artist);
            if (!coverCheckResp.res) {
              console.log('%c picture no album ', 'background: #222; color: #FF0000');
              await saveCover(freeID,filename,metaData.tags.artist,metaData.tags.picture)
              generalMetaData.CoverID = freeID;
            }else{
              generalMetaData.CoverID = coverCheckResp.coverId;
            }
          }else{
            coverCheckResp = await albumCoverExists(filename,"Unknown");
            if (!coverCheckResp.res) {
              console.log('%c picture no album no Artist ', 'background: #222; color: #0000FF');
              await saveCover(freeID,filename,metaData.tags.artist,metaData.tags.picture)
              generalMetaData.CoverID = freeID;
            }else{
              generalMetaData.CoverID = coverCheckResp.coverId;
            }
          }
        }      
      }

      if (metaData.tags.album) {
        let albumId = await saveAlbum(metaData.tags.album,generalMetaData.ArtistID, generalMetaData.CoverID );
        if(!albumId.res) {
          generalMetaData.AlbumID = albumId.ID;
        }else{
          generalMetaData.AlbumID = albumId.ID;
        }
      }

  
    }
    return generalMetaData;
}

interface MetaData {
    "title":string,
    "artist":string,
    "album": string,
    "genre": string,
    "ArtistID":any,
    "AlbumID":any,
    "CoverID":any;
    "GenreID":any;
}
  