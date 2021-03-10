import { Component, Input, OnInit } from '@angular/core';
import { SelectOption } from "./select-option";
import { domClickFn } from '../../common/tool/jquery-help/jquery-help';
@Component({
  selector: 'hw-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.styl']
})
export class SelectOptionComponent implements OnInit {

  @Input() model: SelectOption;
  @Input() selectedItemFn: (id: string) => void;
  selectedItemLabel = '';
  private showBody = false;
  constructor() { }

  ngOnInit() {
    domClickFn('body', () => {
      this.showBody = false;
    });
  }

  itemClick(val: {
    id: string;
    name: string;
  }) {
    this.selectedItemLabel = val.name;
    if (this.selectedItemFn) this.selectedItemFn(val.id);
    this.showBody=false;
  }

  defaultItem(id:string){
    const node = this.model.listNodes.find(x=>x.id==id);
    this.itemClick(node);
  }

}
