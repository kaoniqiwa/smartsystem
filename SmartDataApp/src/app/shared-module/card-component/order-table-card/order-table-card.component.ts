import { Component, Input, OnInit } from '@angular/core';
import { BasisCardComponent, ViewsModel } from '../../../common/abstract/base-view';
import { OrderTable } from "./order-table";
@Component({
  selector: 'app-order-table-card',
  templateUrl: './order-table-card.component.html'
})
export class OrderTableCardComponent extends BasisCardComponent implements OnInit {
  @Input() model: OrderTable;

  selectedItemFn = (id: string) => {
    if (this.btnControl) this.btnControl({ id:id,eventType:this.model.dropList.eventType});
  }
  constructor() {
    super();
  }

  ngOnInit() {
    this.loadDatas(new ViewsModel());
  }

}
