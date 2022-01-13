import { Injectable } from '@angular/core';
import { DexieService } from '../indexdDB/dexie.service'
import { AudioMetadataService } from '../decode/audio-metadata.service'
import { UiService } from '../component/ui.service';
import { WebWorkerService } from '../webworker/web-worker.service'

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  currentDirectoryHandle :any = null;
  dirPermissionGranted:boolean = false;

  constructor(private dexie: DexieService, private audioMetadataService:AudioMetadataService, private uiService:UiService, private webWorkerService:WebWorkerService) { 
    try {
      this.dexie.getTargetDirHandle().then(async (value)=>{
        if (value != undefined) {
          this.currentDirectoryHandle = value;
        }
      });
    } catch (error) {}
  }

  async pickDirectory(){
    let succes = false;
    try {
      let previousDirectoryHandle = this.currentDirectoryHandle;
      this.currentDirectoryHandle = await (window as any).showDirectoryPicker({
        startIn: 'music'
      });
      
      if (this.currentDirectoryHandle != null) {

        await this.dexie.clearCache();
        await this.initPredefinedPlaylist();

        await this.dexie.saveTargetDirHandle(this.currentDirectoryHandle)
        this.uiService.changeStateSpinner(true);
        console.time('indexingFileRefs')
        switch (this.webWorkerService.webWorkerSupported) {
          case true:
            await this.saveFileLinks(this.currentDirectoryHandle);
            break;
          case false:
            await this.saveFileLinksWWFallback(this.currentDirectoryHandle);
            break;
          default:
            await this.saveFileLinksWWFallback(this.currentDirectoryHandle);
            break;
        }
        console.timeEnd('indexingFileRefs')
        this.uiService.changeStateSpinner(false);
        console.log("indexing completed");
        this.uiService.invokeInitMyMusicData();
        succes = true;
      }

    } catch (error:any) {
      if (error.message.toLowerCase() == "window.showDirectoryPicker is not a function".toLowerCase()) {
        alert("Action only supported on chromium browsers 😢")
      }
    }
    return succes;
  }

  async saveFileLinks(dirHandle:any) {
    try {
      let resp = await this.webWorkerService.saveFileReferences(dirHandle);
      
    } catch (error:any) {
      console.log(error)
    }
  }
  
  async saveFileLinksWWFallback(dirHandle:any) {
    try {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === "file" && (entry.name.endsWith(".mp3") || entry.name.endsWith(".m4a") || entry.name.endsWith(".flac"))) {
          let fileExists = await this.dexie.fileRefExist(entry.name)
          if (!fileExists) {
            //const metaData = getId3(await entry.getFile().then((f:any) => readAsArrayBuffer(f)))
            const file = await entry.getFile();
            //const metaData = await entry.getFile().then((f:any) => this.audioMetadataService.getMetaData(f,entry.name))
            const metaData = await this.audioMetadataService.getMetaData(file, entry.name)
            this.dexie.saveAudioFileLink(entry.name, entry, metaData);
          }
        }else if (entry.kind === "directory") {
          const newHandle = await dirHandle.getDirectoryHandle(entry.name);
          await this.saveFileLinksWWFallback(newHandle);
        }
      }
    } catch (error:any) {
      console.log(error)
      if (error.name == "NotAllowedError") {
        console.log(`%cAudioFreak needs permission to read ${dirHandle.name} directory`, "color:red");
      }
    }
  }

  async requestPermission(){
    return new Promise<string>(async (resolve, reject) => {
      try{
        let permissionStatus = await this.currentDirectoryHandle.requestPermission({ mode: "read" })
        if (permissionStatus == 'granted' ) {
          console.log('%c Permission granted ', 'background: #222; color: green');
          this.dirPermissionGranted = true;
          resolve("Permission granted")
        }else{
          reject("Permission denied");
        }
      } catch(e:any){};
    })
	}

  async initPredefinedPlaylist() {
    let predeinedPlaylists:any[] = [
      {key:"Favorites", value: []},
      {key:"Recently Played", value: []},
    ];

    await this.dexie.saveMultiplePlaylist(predeinedPlaylists);
  }

}
