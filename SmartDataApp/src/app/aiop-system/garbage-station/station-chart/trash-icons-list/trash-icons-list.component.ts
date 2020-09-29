import { Component, Input, OnInit } from '@angular/core'; 
import { domClickFn, removeClass } from "../../../../common/tool/jquery-help/jquery-help";
import { TrashIcon } from '../business/station-chart';
@Component({
  selector: 'hw-trash-icons-list',
  templateUrl: './trash-icons-list.component.html',
  styleUrls: ['./trash-icons-list.component.styl']
})
export class TrashIconsListComponent implements OnInit {

  @Input() model: TrashIcon[];
  @Input() itemClickFn: (item: TrashIcon) => void;
  constructor() { }

  ngOnInit() {
    domClickFn('body', () => { 
    
    removeClass('iconList', 'in');
    });
  }

  trashIconListClick(item: TrashIcon) {
    this.model.map(x => x.selected = false);
    item.selected = !item.selected;
    if (this.itemClickFn) this.itemClickFn(item);
  }

}
