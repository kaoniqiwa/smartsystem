import { Component, Input, OnInit } from '@angular/core';
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
import { OrderTable } from "./order-table";
@Component({
  selector: 'app-order-table-card',
  templateUrl: './order-table-card.component.html',
  styles:['.link-text>h4:hover{ color:#6997ff}']
})
export class OrderTableCardComponent extends BasisCardComponent implements OnInit {
  @Input() model: OrderTable;

  selectedItemFn = (id: string) => {
    
    if (this.btnControl&&this.model.dropListV1) this.btnControl({ id:id,eventType:this.model.dropListV1.eventType});
    else if (this.btnControl&&this.model.dropList) this.btnControl({ id:id,eventType:this.model.dropList.eventType});
  }
  constructor() {
    super();
  }

  ngOnInit() {
    this.loadDatas(new ViewsModel());
  }

  itemClick(id:string){
    if(id)
    this.btnControl({ id:id,eventType:null});
  }

}
