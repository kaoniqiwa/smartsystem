import { Component, AfterContentInit, OnInit } from '@angular/core';
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
import { StateScale } from "./state-scale";
@Component({
  selector: 'app-state-scale-card',
  templateUrl: './state-scale-card.component.html',
  styleUrls:['./state-scale-card.component.css']
})
export class StateScaleCardComponent  extends BasisCardComponent implements OnInit {
   model: StateScale;
  constructor() {
    super();
   }

   ngOnInit() {
    this.loadDatas(new ViewsModel());
   }
   itemClick(item: {   tag:any; }){     
    if(this.btnControl&&this.model)this.btnControl(item);
  }

}
