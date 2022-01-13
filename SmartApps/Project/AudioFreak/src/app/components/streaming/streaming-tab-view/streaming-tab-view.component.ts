import { Component, OnInit } from '@angular/core';
import {TabItem} from '../../../interfaces/TabItem.interface'

@Component({
  selector: 'app-streaming-tab-view',
  templateUrl: './streaming-tab-view.component.html',
  styleUrls: ['./streaming-tab-view.component.css']
})
export class StreamingTabViewComponent implements OnInit {


  tabs:TabItem[] = [
    {
      label:"Youtube",
      route:"youtube-tab"
    },
/*     {
      label:"...",
      route:"stream2-tab"
    } */
  ];

  activeLink = this.tabs[0];

  constructor() { }

  ngOnInit(): void {
  }

}
