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
  @Input() videoFileFn :(id:string)=>void; 
  constructor() { }

  ngOnInit() {
  }

  videoClick(){
   if(this.videoFn) this.videoFn(this.model.id);
  }
  videoFileClick(){
    if(this.videoFileFn) this.videoFileFn(this.model.id);
  } 

  get imgFileName(){
    return `${this.model.leftDesc[0]} ${this.model.rightDesc[0]} ${this.model.rightDesc[1]} ${this.model.leftDesc[1]}.png`;
  }
}
