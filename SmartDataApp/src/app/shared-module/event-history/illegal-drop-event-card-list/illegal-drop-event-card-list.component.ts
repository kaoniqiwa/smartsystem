import { Component, OnInit,Input } from '@angular/core';
import {  CardList } from "./card-list";
import { ImageDesc } from "../../image-desc-card/image-desc";
@Component({
  selector: 'hw-illegal-drop-event-card-list',
  templateUrl: './illegal-drop-event-card-list.component.html',
  styleUrls: ['./illegal-drop-event-card-list.component.styl']
})
export class IllegalDropEventCardListComponent implements OnInit {

  @Input() model:CardList;
  @Input() itemFn:(val:ImageDesc)=>void;
  @Input() playVideoFn :(id:string)=>void;
  constructor() { }

  ngOnInit() {
  }

  itemClick(item:ImageDesc){
     this.model.value.map(x=>x.selected = false);
     item.selected=!item.selected;
     if(this.itemFn)this.itemFn(item);
  }
}
