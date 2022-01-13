import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/component/ui.service';
@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css']
})
export class StreamingComponent implements OnInit {

  constructor(private uiService:UiService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.uiService.changeNavTitle("Streaming");
    }, 0);
  }

  

}
