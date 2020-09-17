import { Component, Input, OnInit } from '@angular/core';
import { BasisCardComponent, ViewsModel } from '../../common/abstract/base-view';
import { DivisionTypeEnum } from '../../common/tool/enum-helper';
import { HeaderSquareList } from "./header-square-list";
@Component({
  selector: 'hw-header-square-list',
  templateUrl: './header-square-list.component.html'
})
export class HeaderSquareListComponent extends BasisCardComponent implements OnInit {

  @Input() model: HeaderSquareList;
  private selectedId_ = ''; 
  constructor() {
    super();
  }

  ngOnInit() {
    this.loadDatas(new ViewsModel());
  }

  set selectedId(id: string) {
    this.selectedId_ = id;
    
  }

  itemClick(id:string,type:DivisionTypeEnum){
     this.selectedId = id; 
     if(this.btnControl)this.btnControl({
        id:id,
        type:type
     });
  }

  get selectedId() {
    return this.selectedId_;
  }

}
