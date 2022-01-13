import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { fader, /* slider */ } from '../../route-animations'
@Component({
  selector: 'app-my-music',
  templateUrl: './my-music.component.html',
  styleUrls: ['./my-music.component.css'],
/*   animations: [
    fader
  ] */
})

export class MyMusicComponent implements OnInit{

  constructor(){}

  async ngOnInit(){}
  
/*   prepareRoute(outlet:RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
  } */

}

