import { Component, ViewChild, AfterViewInit, OnInit, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout'
import { UiService } from './services/component/ui.service';
import { DirectoryService } from './services/FileSystem/directory.service'
import { Subscription } from 'rxjs';
import { EQBottomsheetComponent } from './components/equalizer/eqbottomsheet/eqbottomsheet.component'
import { BasicDialogComponent } from './components/basic-dialog/basic-dialog.component'
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PreviousRouteService } from './services/component/previous-route.service';
import {themeOption, defaultTheme} from './interfaces/themeOption'
import { DexieService } from './services/indexdDB/dexie.service';
import { StyleManagerService } from './style-manager.service';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('drawer') sidenav!:MatSidenav;
  @ViewChild('mypip') pip!:ElementRef;
  @ViewChild('searchInp') searchInp:ElementRef;

  title = 'AudioFreak';
  navbarTitle: string = "";
  subscription: Subscription;

  showSpinner:any = false;
  showSpinnerSubsription: Subscription;

  fullView:boolean = false;
  FVsubscription: Subscription;

  PiPstatus:boolean = false;
  PiPstatusSubscription!:Subscription;

  iFrameData:any = {ID : "https://www.youtube-nocookie.com/embed/"};
  iFrameDataSubscription!:Subscription;

  Theme:themeOption= defaultTheme;
  private readonly stylesBasePath = `../assets/prebuiltThemes/`;

  myMusicviewInView:boolean = true;

  showFolderButton:boolean = false;

  constructor(private cdref: ChangeDetectorRef,private router: Router, private previousRouteService: PreviousRouteService,private styleManager:StyleManagerService ,private dexieService: DexieService, public dialog: MatDialog, private breakpointObserver:BreakpointObserver, private uiService:UiService, private directoryService:DirectoryService, private _bottomSheet: MatBottomSheet){
    this.PiPstatusSubscription = uiService.onTogglePiPStatus().subscribe( (bool) => this.PiPstatus  = bool)
    this.iFrameDataSubscription= uiService.getIframeData().subscribe( (data) => {
      this.Theme = this.uiService.themeColor;
      this.iFrameData = data
      this.pip.nativeElement.src = data.ID;
    })


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('my-music') || event.url == "/") {
          //console.log('NavigationEnd:', event);
          this.myMusicviewInView = true;
        }else{
          this.myMusicviewInView = false;
        }
      }
    });
  
    this.subscription = this.uiService.onNavTitleChange().subscribe((value => this.navbarTitle = value));
    this.showSpinnerSubsription = this.uiService.onSpinnerStateChange().subscribe((value => this.showSpinner = value));
    this.FVsubscription = this.uiService.onToggleFullView().subscribe(toggleBool => {
      this.fullView = toggleBool;
    });

    this.uiService.onCacheCleared().subscribe(async () => {await this.toggleFolderButton()});
  }

  async ngOnInit(){
    this.initSettings();
    await this.initData();
    await this.toggleFolderButton();
  }

  async toggleFolderButton(){
    if (await this.dexieService.getTargetDirHandle() == null) {
      this.showFolderButton = true;
    }
  }

  async initData(){
    await this.dexieService.savePlaybackData('tracksInQueue', []);
    await this.initPlaylistsData();
  }

  async initSettings(){
    let response = await this.dexieService.getSetting("themecolor");
    this.Theme = response != null ? response : this.Theme;
    this.uiService.setThemeColor(this.Theme);
    this.styleManager.setStyle(`${this.stylesBasePath}${this.Theme.value}.css`);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.breakpointObserver.observe(['(max-width:800px)']).subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else{
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }

      })
    }, 0);
    
  }

  ngAfterViewChecked(): void {
    if (this.router.url.includes('my-music') || this.router.url == "/") {
      if (this.showSearchBox == true) {
        this.searchInp.nativeElement.focus();
        //Prevent [ExpressionChangedAfterItHasBeenCheckedError]
        this.cdref.detectChanges();
      }
    }
  }

  async openDirPicker(){
    this.dialog.open(BasicDialogComponent, {
      data: {
        header: "Importing music",
        text:"Show us in which directory we should look for music. \n\nNOTE: any music/files outside this folder will not be indexed.",
        closeBtnText:"Ok"
      },
    });

    let dialogSubscription = this.dialog.afterAllClosed.subscribe( async () => {
      let succes = await this.directoryService.pickDirectory();
      if (succes == true) {
        this.showFolderButton = false;
      }
      dialogSubscription.unsubscribe();
    })

  }

  openBottomSheet(): void {
    this._bottomSheet.open(EQBottomsheetComponent);
  }
  
  onNoClick(){
    this.uiService.togglePiPStatus(null);
    this.iFrameData.ID = "https://www.youtube-nocookie.com/embed/";
    this.pip.nativeElement.src = "https://www.youtube-nocookie.com/embed/";

  }


  async initPredefinedPlaylist() {
    let predeinedPlaylists:any[] = [
      {key:"Favorites", value: []},
      {key:"Recently Played", value: []},
    ];

    await this.dexieService.saveMultiplePlaylist(predeinedPlaylists);
  }

  async initPlaylistsData(){
    let idbResp:[] = await this.dexieService.getAllPlaylists();
    if (idbResp.length == 0 ) {
      await this.initPredefinedPlaylist();
    }
  }

  showSearchBox:boolean;
  toggleSearchBox(){
    if (this.showSearchBox == true) {
      let searchTerm = this.searchInp.nativeElement.value.trim();
      if (!(searchTerm.length <= 0)) {
/*         if (this.router.url.includes('/my-music/(mymusicContent:search')) {
          this.uiService.changeSearchTerm(searchTerm);
        }else{
          this.routeSearchView(searchTerm);
        } */
        this.routeSearchView(searchTerm);
      }
    }
    this.showSearchBox = !this.showSearchBox;
  }


  routeSearchView(term:string){
    this.router.navigate(['/my-music',{outlets: { mymusicContent: ['search', term] }}]);
  }


}

