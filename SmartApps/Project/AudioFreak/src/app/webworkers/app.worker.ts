import { dexie } from '../../app/dexieDB'; 



/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  let response = null;

  switch (data.action) {
    case "getArtists":
      response = await getArtists();
      break;
    case "getAlbumsWithCover":
      response = await getAlbumsWithCover();
      break;
    case "getTracksWithHandle":
      response = await getTracksWithHandle();
      break;      
    case "getGenres":
      response = await getGenres();
      break;      
  }
  postMessage({sourceWorker:"mainWorker", response:response});
});

async function getTracksWithHandle(){
  return await dexie.table("fileLinks").toArray();
}

async function getArtists(){
  return await dexie.table("artists").toArray();
}

async function getGenres(){
  return await dexie.table("genres").toArray();
}

async function getAlbumsWithCover(){

  let albumsWithCover :any = [];
  
  for (const item of await dexie.table("albums").toArray()) {

    let result = {
      album:item,
      artist: null as any,
      coverData: null as any,
    }

    if (item.ArtistId != null && item.ArtistId != "null") {
      let artistObj = await dexie.table("artists").where("ID").equals(item.ArtistId).first();
      result.artist = artistObj.Name;
    }

    if (item.CoverId != null) {
      let coverObj = await dexie.table("covers").where("ID").equals(item.CoverId).first();
      const url = URL.createObjectURL(coverObj.coverData);
      result.coverData = url;
    }

    albumsWithCover.push(result);
  }

  return albumsWithCover;
}




export async function saveArtist(name:string){
  let response = await artistExists(name);
  if (!response.res) {
    let lastID = await getLastFreeArtistID();
    await dexie.table("artists").add({
      ID:lastID,
      Name: name,
    });
    response.artistId = lastID;
  }
  return response;
}

async function artistExists(artist:string){
  const result = await dexie.table("artists").where("Name").equalsIgnoreCase(artist).first();
  
  if(result) {
    return {res:true, artistId:result.ID};
  }else{
    return {res:false, artistId: null};
  }
}

async function getLastFreeArtistID(){
  let lastID = await dexie.table("artists").orderBy('ID').last();
  if (lastID != undefined) {
    return lastID.ID + 1; 
  }else{
    return 0;
  }
}

export async function getLastFreeCoverID():Promise<number>{
  let lastID = await dexie.table("covers").orderBy('ID').last();
  if (lastID != undefined) {
    return lastID.ID + 1; 
  }else{
    return 0;
  }
}

export async function albumCoverExists(album:string, artist:string){
  const result = await dexie.table("covers").where({
    Album: album,
    Artist: artist
  }).first();
  
  if(result) {
    return {res:true, coverId:result.ID};
  }else{
    return {res:false, coverId: null};
  }
}

export async function saveCover(id:number,text:string, artist:string ,coverData:any){

  const { data, type } = coverData;
  const byteArray = new Uint8Array(data);
  const blob = new Blob([byteArray], { type });

  await dexie.table("covers").add({
    ID:id,
    Album: text,
    Artist:artist,
    coverData: blob
  });
}

export async function saveAlbum(name:string,artistId:any,coverId:number){
  let response = await albumExists(name,artistId);
  if (!response.res) {
    let lastID = await getLastFreeAlbumID();

    if (artistId == null) {artistId = "null"}

    await dexie.table("albums").add({
      ID:lastID,
      Name: name,
      ArtistId:artistId,
      CoverId: coverId
    });
    response.ID = lastID;
  }
  return response;
}

async function albumExists(album:string, artistId:any):Promise<any>{
  
  if (artistId == null) {artistId = "null"}

  const result = await dexie.table("albums").where({
    Name: album,
    ArtistId: artistId
  }).first();

  if(result) {
    return {res:true, ID:result.ID, Name:result.Name , ArtistId:result.ArtistId, CoverId: result.CoverId};
  }else{
    return {res:false, ID: null};
  }
}

async function getLastFreeAlbumID():Promise<number>{
  let lastID = await dexie.table("albums").orderBy('ID').last();
  if (lastID != undefined) {
    return lastID.ID + 1; 
  }else{
    return 0;
  }
}


export async function saveGenre(genre:string){
  let response = await genreExists(genre);
  if (!response.res) {
    let lastID = await getLastFreeGenreID();
    await dexie.table("genres").add({
      ID:lastID,
      Genre: genre,
    });
    response.genreId = lastID;
  }
  return response;
}

async function genreExists(genre:string){
  const result = await dexie.table("genres").where("Genre").equalsIgnoreCase(genre).first();
  
  if(result) {
    return {res:true, genreId:result.ID};
  }else{
    return {res:false, genreId: null};
  }
}

async function getLastFreeGenreID(){
  let lastID = await dexie.table("genres").orderBy('ID').last();
  if (lastID != undefined) {
    return lastID.ID + 1; 
  }else{
    return 0;
  }
}