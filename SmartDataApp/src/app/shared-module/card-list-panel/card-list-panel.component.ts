import { Component, OnInit, Input ,Output,EventEmitter} from '@angular/core';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component';
import { PanelView, EventTypeEnum, CardListPanel } from "./card-list-panel";
@Component({
  selector: 'hw-card-list-panel',
  templateUrl: './card-list-panel.component.html',
  styleUrls: ['./card-list-panel.component.styl']
})
export class CardListPanelComponent implements OnInit {
  @Input() model: PanelView;

  @Input() itemMouseEnterFn:(id:string)=>boolean;
  //已选中id
  private selectedId_: string[] = [];
  private confirmDialog_: ConfirmDialog;
  constructor() { }

  ngOnInit() {
  }

  set selectedId(val: any) {
    this.selectedId_ = val;
  }

  get selectedId() {
    return this.selectedId_;
  }

  itemMouseEnter(id:string){
     const move=this.itemMouseEnterFn(id);
     if(move){
      var index = this.selectedId.indexOf(id);
      if (index < 0)
        this.selectedId.push(id);
     }
  }

  itemMouseLeave(id:string){
    const move=this.itemMouseEnterFn(id);
    if(move){
     var index = this.selectedId.indexOf(id);
     if (index > -1)
      this.selectedId.splice(index, 1);
    }
  }

  listItemDelClick(listId: string, itemId: string) {   
     
      this.confirmDialog_ = new ConfirmDialog();
      this.confirmDialog_.cancelFn = () => {
          this.confirmDialog_ = null;
      }
      this.confirmDialog_.content = '确定删除该模型配置';
      this.confirmDialog_.okFn = () => {
        if (this.model.event){
          this.model.event(EventTypeEnum.ListItemDel, listId, itemId);
          this.confirmDialog_ = null;
        }
      }
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
    this.selectedId_ = [];
    this.model.listPanel.map(l => {
      this.selectedId_.push(l.id);
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

  toCopy(cardListPanel: CardListPanel) {
    return cardListPanel.barBody && cardListPanel.barBody.length;
  }
}
