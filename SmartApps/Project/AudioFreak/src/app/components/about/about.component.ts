import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/component/ui.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
    setTimeout(() => {


      this.uiService.changeNavTitle("About");
    }, 0);
  }

}
