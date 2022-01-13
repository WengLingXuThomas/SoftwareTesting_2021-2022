import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyMusicComponent } from './components/my-music/my-music.component';
import { EqualizerComponent } from './components/equalizer/equalizer.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StreamingComponent } from './components/streaming/streaming.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';

import { ArtistViewComponent } from './components/my-music/artist-view/artist-view.component';
import { AlbumViewComponent } from './components/my-music/album-view/album-view.component';
import { GenreViewComponent } from './components/my-music/genre-view/genre-view.component';

import { TabViewComponent } from './components/my-music/tab-view/tab-view.component';
import { TracksTabComponent } from './components/my-music/tab-view/tracks-tab/tracks-tab.component'
import { ArtistsTabComponent } from './components/my-music/tab-view/artists-tab/artists-tab.component'
import { AlbumsTabComponent } from './components/my-music/tab-view/albums-tab/albums-tab.component'
import { GenresTabComponent } from './components/my-music/tab-view/genres-tab/genres-tab.component'

import {StreamingTabViewComponent} from './components/streaming/streaming-tab-view/streaming-tab-view.component'
import { YoutubeTabComponent } from './components/streaming/streaming-tab-view/youtube-tab/youtube-tab.component'

import {PlaylistsOverviewComponent} from './components/playlists/playlists-overview/playlists-overview.component'
import {PlaylistTracksComponent} from './components/playlists/playlists-overview/playlist-tracks/playlist-tracks.component'

import {MyMusicTabsGuard} from './MyMusicTabsGuard.guard'
import { AboutComponent } from './components/about/about.component';

import {SearchViewComponent} from './components/my-music/search-view/search-view.component'

let defaultTabRoute = '/my-music/(mymusicContent:musictabs/(mytabs:tracks-tab))'

const routes: Routes = [
  //Alle mogenlijke routes die opgeroepen kan worden in andere componenten
  {path:'', redirectTo:'/my-music/(mymusicContent:musictabs/(mytabs:tracks-tab))', pathMatch:'full'},
  {path:'my-music', component: MyMusicComponent,
    children: [
      {path:'', canActivate: [MyMusicTabsGuard], children: [], pathMatch:'full'},
      {
        path: "musictabs",
        component: TabViewComponent,
        outlet: "mymusicContent",
        children: [
          {
            path: "tracks-tab",
            component: TracksTabComponent,
            outlet: "mytabs"
          },
          {
            path: "artists-tab",
            component: ArtistsTabComponent,
            outlet: "mytabs"
          },
          {
            path: "albums-tab",
            component: AlbumsTabComponent,
            outlet: "mytabs"
          },
          {
            path: "genres-tab",
            component: GenresTabComponent,
            outlet: "mytabs"
          }
        ],
        data: {animation:'isLeft'}
      },
      {
        path: "artist/:id/:name",
        component: ArtistViewComponent,
        outlet: "mymusicContent",
        data: {animation:'isRight'}
      },
      {
        path: "album/:id/:title",
        component: AlbumViewComponent,
        outlet: "mymusicContent"
      },
      {
        path: "genre/:id/:genre",
        component: GenreViewComponent,
        outlet: "mymusicContent"
      },
      {
        path: "search/:term",
        component: SearchViewComponent,
        outlet: "mymusicContent"
      },
    ]
  },
  {path:'streaming', component: StreamingComponent,
    children: [
      {path:'', redirectTo:'/streaming/(streamingContent:streamingtabs/(streamtabs:youtube-tab))', pathMatch:'full'},
      {
        path: "streamingtabs",
        component: StreamingTabViewComponent,
        outlet: "streamingContent",
        children: [
          {
            path: "youtube-tab",
            component: YoutubeTabComponent,
            outlet: "streamtabs"
          }
        ]
      }
    ]
  },
  {path:'playlists', component: PlaylistsComponent,
  children: [
    {path:'', redirectTo:"/playlists/(playlistsOutlet:playlistOverview)", pathMatch:'full'},
    {
      path: "playlistOverview",
      component: PlaylistsOverviewComponent,
      outlet: "playlistsOutlet",
    },
    {
      path: "playlist/:id",
      component: PlaylistTracksComponent,
      outlet: "playlistsOutlet"
    },
  ]
  },
  {path:'equalizer', component: EqualizerComponent},
  {path:'settings', component: SettingsComponent},
  {path:'about', component: AboutComponent},
];

/* //tabs worden gelazyload
const routes: Routes = [
  {path:'', redirectTo:'/my-music', pathMatch:'full'},
  {path:'my-music', component: MyMusicComponent},
  {
    path:'tracks-tab',
    loadChildren: () =>import('./modules/my-music/tracks-tab/tracks-tab.module').then((m) => m.TracksTabModule)
  },
  {
    path:'artists-tab',
    loadChildren: () =>import('./modules/my-music/artists-tab/artists-tab.module').then((m) => m.ArtistsTabModule)
  },
  {
    path:'albums-tab',
    loadChildren: () =>import('./modules/my-music/albums-tab/albums-tab.module').then((m) => m.AlbumsTabModule)
  },
  {path:'streaming', component: StreamingComponent},
  {path:'playlists', component: PlaylistsComponent},
  {path:'equalizer', component: EqualizerComponent},
  {path:'settings', component: SettingsComponent},
]; */

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [MyMusicTabsGuard],
})
export class AppRoutingModule {}
