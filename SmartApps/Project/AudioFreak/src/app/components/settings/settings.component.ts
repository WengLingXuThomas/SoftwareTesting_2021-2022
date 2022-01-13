import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/component/ui.service';
import options from '../../../assets/themeOptions.json'
import { StyleManagerService } from "../../style-manager.service";
import { themeOption } from '../../interfaces/themeOption';
import { DexieService } from '../../services/indexdDB/dexie.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { BasicDialog2Component } from '../basic-dialog2/basic-dialog2.component'
import { DirectoryService } from '../../services/FileSystem/directory.service'
import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterContentChecked{

  @ViewChildren('slideToggle') tabSlideToggles:QueryList<MatSlideToggle>;

  options: Array<themeOption> = options;
  selectedTheme: themeOption = options[0];
  tabs: any[] = [
    { name: 'Tracks', enabled: true },
    { name: 'Artists', enabled: true },
    { name: 'Albums', enabled: true },
    { name: 'Genres', enabled: true },
  ];
  viewOption: any[] = [
    { name: 'Grid View', icon: 'view_module' },
    { name: 'List View', icon: 'view_headline' }
  ];
  selectedView: any = this.viewOption[0];
  panelOpenState = false;
  private readonly stylesBasePath = `../../../assets/prebuiltThemes/`;
  selectedThemeSubscription: Subscription;

  lastTabToggle:boolean = false;

  constructor(private _snackBar: MatSnackBar, private cdref: ChangeDetectorRef, public dialog: MatDialog, private uiService: UiService, private directoryService:DirectoryService, private dexieService: DexieService, private readonly styleManager: StyleManagerService) { }
 
  async ngOnInit() {
    this.initSettings();

    setTimeout(() => {


      this.uiService.changeNavTitle("Settings");
    }, 0);
  }

  ngAfterContentChecked() {
    //Prevent [ExpressionChangedAfterItHasBeenCheckedError]
    this.cdref.detectChanges();
  }

  async initSettings() {
    let response: any;
    response = await this.dexieService.getSetting("tabs");
    this.tabs = response != null ? response : this.tabs;
    this.renderTabDescription(this.tabs);

    response = await this.dexieService.getSetting("themecolor");
    this.selectedTheme = response != null ? response : this.selectedTheme;
    response = await this.dexieService.getSetting("albumView");
    this.selectedView = response != null ? response : this.selectedView;
  }

  renderTabDescription(tabs:any){
    this.tabDesc = ""

    for (const tab of tabs) {
      this.tabDesc  += ` > ${tab.name}`;
    }
    this.tabDesc = this.tabDesc.substring(2)
  }

  disableToggle(e:MatSlideToggle){
    let shouldDisable = false;

    let enabledTabs = this.tabs.filter(t => t.enabled == true);
    if (enabledTabs.length == 1) {
      if (e._elementRef.nativeElement.dataset.for == enabledTabs[0].name) {
        shouldDisable = true;
      }
    }

    return shouldDisable;
  }

  async themeChangeHandler(themeToSet: themeOption) {
    this.selectedTheme = themeToSet;
    this.styleManager.setStyle(`${this.stylesBasePath}${themeToSet.value}.css`);
    this.uiService.setThemeColor(this.selectedTheme);
    await this.dexieService.saveSetting("themecolor", this.selectedTheme);
  }

  async albumViewChangeHandler(view: any) {
    this.selectedView = view;
    await this.dexieService.saveSetting("albumView", this.selectedView)
  }

  async onEnableChange(e: any, tab: any) {
    this.tabs.find(x => x.name == tab.name).enabled = e.checked;
    await this.dexieService.saveSetting("tabs", this.tabs);

    let enabledTabs = this.tabs.filter(t => t.enabled == true);
    if (enabledTabs.length == 1) {
      this.tabSlideToggles.find(t => t.checked == true).setDisabledState(true);
    }else{
      for (let toggle of this.tabSlideToggles.toArray()) {
        if (toggle.disabled == true) {
          toggle.setDisabledState(false);
        }
      }
    }
  }

  showToast(e:MatSlideToggle){
    if(e.disabled == true){
      this._snackBar.open("You need to have atleast one tab enabled!", null , {duration: 2500});
    }
  }

  tabDesc: string = "Tracks > Artists > Albums > Genres";
  async drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    await this.dexieService.saveSetting("tabs", this.tabs)

    this.renderTabDescription(this.tabs);
  }

  async openDirPicker() {
    this.dialog.open(BasicDialogComponent, {
      data: {
        header: "Importing music",
        text:"Show us in which directory we should look for music. \n\nNOTE: any music/files outside this folder will not be indexed.",
        closeBtnText:"Ok"
      },
    });

    let dialogSubscription = this.dialog.afterAllClosed.subscribe(() => {
      this.directoryService.pickDirectory();
      dialogSubscription.unsubscribe();
    })
  }

  async dialogResponse() {
    const dialogRef = this.dialog.open(BasicDialog2Component, {
      data: {
        header: "Clearing Cache",
        text: "You are about to clear the Cache\nAll music references will be deleted.",
        closeBtnText: "Clear"
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.clearDexie();
      }
    })
  }
  async clearDexie() {
    await this.dexieService.clearCache(true,true);
  }

}
