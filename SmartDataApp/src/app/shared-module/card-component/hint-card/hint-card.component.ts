import { Component, Input, OnInit } from '@angular/core';
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
import { Hint,HintTag} from "./hint";
@Component({
  selector: 'app-hint-card',
  templateUrl: './hint-card.component.html'
})
export class HintCardComponent extends BasisCardComponent implements OnInit {
  @Input() model: Hint[];
  constructor() {
    super();
   }

  ngOnInit() {
    this.loadDatas(new ViewsModel());
  }

  tagClick(tag:HintTag){     
    if(this.btnControl&&this.model)this.btnControl(tag);
  }

}
