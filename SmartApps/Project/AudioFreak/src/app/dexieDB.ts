import Dexie from "dexie";

export const dexie = new Dexie("idb-storage");
dexie.version(4).stores({
  fileHandles: 'key,value',
  fileLinks: 'fileName,fileHandle,fileMeta',
  covers: 'ID,[Album+Artist],coverData',
  artists: 'ID,Name',
  albums: 'ID,[Name+ArtistId],CoverId',
  genres:'ID, Genre',
  lyrics: 'ID,[Title+Artist],Text',
  playlists:'key,value',
  playbackData:'key,value',
  settings: 'key,value'
});