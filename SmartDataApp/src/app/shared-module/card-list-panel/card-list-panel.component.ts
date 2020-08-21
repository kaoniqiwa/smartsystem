import { Component, OnInit, Input } from '@angular/core';
import { PanelView,EventTypeEnum } from "./card-list-panel";
@Component({
  selector: 'hw-card-list-panel',
  templateUrl: './card-list-panel.component.html',
  styleUrls: ['./card-list-panel.component.styl']
})
export class CardListPanelComponent implements OnInit {
  @Input() model: PanelView;
  //已选中id
  private selectedId_: string[] = [];
  constructor() { }

  ngOnInit() {
  }

  set selectedId(val: any) {
    this.selectedId_ = val;
  }

  get selectedId() {
    return this.selectedId_;
  }

  listItemDelClick(listId:string,itemId:string){
   if(this.model.event)this.model.event(EventTypeEnum.ListItemDel,listId,itemId);
  }

  //列表项点击事件
  itemClick(id: string) {
    var index = this.selectedId.indexOf(id);
    if (index < 0)
      this.selectedId.push(id);
    else
      this.selectedId.splice(index, 1);

  }

  //列表全选
  selectAll(): void {
    this.selectedId = [];
    this.model.listPanel.map(l => {
      this.selectedId.push(l.id);
    });
  }

  //列表反选
  selectInvert(): void {
    this.model.listPanel.map(l => {
      this.itemClick(l.id);
    });
  }

  //取消列表选中项
  selectCancel(): void {
    this.selectedId = [];
  }
}
