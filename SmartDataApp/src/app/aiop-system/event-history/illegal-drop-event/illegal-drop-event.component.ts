import { Component, OnInit ,ViewChild} from '@angular/core';
import {  IllegalDropEventAnalyzeComponent } from "../illegal-drop-event-analyze/illegal-drop-event-analyze.component";
import { ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-illegal-drop-event',
  templateUrl: './illegal-drop-event.component.html'
})
export class IllegalDropEventComponent implements OnInit {

  viewsShow = [true,false,false];
  viewShowFn = (index:number)=>{
   for (let o = 0; o < this.viewsShow.length; o++) 
    this.viewsShow[o]= index == o;
     
  }
  urlParam = false;
  @ViewChild(IllegalDropEventAnalyzeComponent)
  IllegalDropEventAnalyzeComponent:IllegalDropEventAnalyzeComponent;
  constructor( 
    private route:ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
          this.urlParam = params.p !=null;
      });
     }

  ngOnInit() {
 
  }

}
