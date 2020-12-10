import { Component, Input, OnInit } from '@angular/core';
import { GalleryRollPage } from "./gallery-roll-page";
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
@Component({
  selector: 'hw-gallery-roll-page',
  templateUrl: './gallery-roll-page.component.html',
  styleUrls: ['./gallery-roll-page.component.styl']
})
export class GalleryRollPageComponent extends BasisCardComponent implements OnInit {

  @Input() model: GalleryRollPage;

  constructor() {
    super();
  }


  ngOnInit() {
    this.loadDatas(new ViewsModel());
     
    window.setInterval(()=>{
      if(this.model){
        this.model.index += 1;
        if (this.model.index > this.model.items.size)
        this.model.index =1;
      }
    },60*1000)
  }

  get items() {
    return this.model.items.get(this.model.index);


  }

  get title() {
    return this.model.items.get(this.model.index).title.text;
  }

  nextImgGroup() {
 
    this.model.index += 1;
    if (this.model.index > this.model.items.size)
      this.model.index = this.model.items.size;
  }

  prevImgGroup() {
    this.model.index -= 1;
    if (this.model.index <= 0)
      this.model.index = 1;
  }

  tagClick(tag: any) {
    if (this.btnControl && this.model) this.btnControl(tag);
  }
}
