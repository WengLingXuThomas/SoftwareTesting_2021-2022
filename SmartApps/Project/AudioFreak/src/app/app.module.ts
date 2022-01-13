import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import {DemoMaterialModule} from './material-module';
import { OrderByPipe } from './pipe/order-by.pipe';

import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

import { SettingsComponent } from './components/settings/settings.component';
import { EqualizerComponent } from './components/equalizer/equalizer.component';
import { StreamingComponent } from './components/streaming/streaming.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';

import { MyMusicComponent } from './components/my-music/my-music.component';
import { TracksTabComponent } from './components/my-music/tab-view/tracks-tab/tracks-tab.component';
import { ArtistsTabComponent } from './components/my-music/tab-view/artists-tab/artists-tab.component';
import { AlbumsTabComponent } from './components/my-music/tab-view/albums-tab/albums-tab.component';
import { GenresTabComponent } from './components/my-music/tab-view/genres-tab/genres-tab.component';

import {IvyCarouselModule} from 'angular-responsive-carousel';
import { LazyLoadImageModule } from 'ng-lazyload-image'; 
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { EQBottomsheetComponent } from './components/equalizer/eqbottomsheet/eqbottomsheet.component';
import { FullviewComponent } from './components/audio-player/fullview/fullview.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { VibottomsheetComponent } from './components/visualizer/vibottomsheet/vibottomsheet.component';
import { ArtistViewComponent } from './components/my-music/artist-view/artist-view.component';
import { TabViewComponent } from './components/my-music/tab-view/tab-view.component';
import { TracklistComponent } from './components/my-music/tracklist/tracklist.component';
import { BasicDialogComponent } from './components/basic-dialog/basic-dialog.component';
import { AlbumViewComponent } from './components/my-music/album-view/album-view.component';
import { StreamingTabViewComponent } from './components/streaming/streaming-tab-view/streaming-tab-view.component';
import { YoutubeTabComponent } from './components/streaming/streaming-tab-view/youtube-tab/youtube-tab.component';
import { LyricsComponent } from './components/audio-player/lyrics/lyrics.component';
import { LyricConfirmDialogComponent } from './components/audio-player/lyrics/lyric-confirm-dialog/lyric-confirm-dialog.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { StyleManagerService } from './style-manager.service';
import { BasicDialog2Component } from './components/basic-dialog2/basic-dialog2.component';
import { GenreViewComponent } from './components/my-music/genre-view/genre-view.component';
import { AboutComponent } from './components/about/about.component';
import { CreatePlaylistDialogComponent } from './components/playlists/create-playlist-dialog/create-playlist-dialog.component';
import { PlaylistTracksComponent } from './components/playlists/playlists-overview/playlist-tracks/playlist-tracks.component';
import { PlaylistsOverviewComponent } from './components/playlists/playlists-overview/playlists-overview.component';
import { SearchViewComponent } from './components/my-music/search-view/search-view.component';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AudioPlayerComponent,
    MyMusicComponent,
    OrderByPipe,
    SettingsComponent,
    EqualizerComponent,
    StreamingComponent,
    PlaylistsComponent,
    TracksTabComponent,
    ArtistsTabComponent,
    AlbumsTabComponent,
    EQBottomsheetComponent,
    FullviewComponent,
    VisualizerComponent,
    VibottomsheetComponent,
    ArtistViewComponent,
    TabViewComponent,
    GenresTabComponent,
    TracklistComponent,
    BasicDialogComponent,
    AlbumViewComponent,
    StreamingTabViewComponent,
    YoutubeTabComponent,
    LyricsComponent,
    LyricConfirmDialogComponent,
    BasicDialog2Component,
    GenreViewComponent,
    AboutComponent,
    CreatePlaylistDialogComponent,
    PlaylistTracksComponent,
    PlaylistsOverviewComponent,
    SearchViewComponent,
  ],
  imports: [
    DemoMaterialModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    TableVirtualScrollModule,
    VirtualScrollerModule,
    LazyLoadImageModule,
    IvyCarouselModule,
    NgScrollbarModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    StyleManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
