import { Component, OnInit,Input } from '@angular/core';
import {ImageDesc   } from "./image-desc";
@Component({
  selector: 'hw-image-desc-card1',
  templateUrl: './image-desc-card.component.html',
  styleUrls: ['./image-desc-card.component.styl']
})
export class ImageDescCardComponent implements OnInit {

  selected = false;
  @Input() model:ImageDesc;
  @Input() videoFn :(id:string)=>void;
  constructor() { }

  ngOnInit() {
  }

  videoClick(){
   if(this.videoFn) this.videoFn(this.model.id);
  }

}
