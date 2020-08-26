import { Component, OnInit } from '@angular/core';
import { TimeToolService } from "./time.service";
@Component({
  selector: 'app-time-tool',
  templateUrl: './time-tool.component.html',
  styleUrls: ['./time-tool.component.styl'],
  providers:[TimeToolService]
})
export class TimeToolComponent implements OnInit {
  
  constructor(private service: TimeToolService) {
    this.service.runTime(); 
    
   }

  ngOnInit() {
  
  }

}
