import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ConfirmDialog } from "../confirm-dialog/confirm-dialog.component";
import { PanelView, EventType, CardListPanel } from "./card-list-panel";
@Component({
  selector: "hw-card-list-panel",
  templateUrl: "./card-list-panel.component.html",
  styleUrls: ["./card-list-panel.component.styl"],
})
export class CardListPanelComponent implements OnInit {
  @Input() model: PanelView;

  @Input() itemMouseEnterFn: (id: string) => boolean;
  //已选中id
  selectedId_ = new Array();
  private confirmDialog_: ConfirmDialog;
  constructor() {}

  ngOnInit() {}

  itemMouseEnter(id: string) {
    const move = this.itemMouseEnterFn(id);
    if (move) {
      var index = this.selectedId_.indexOf(id);
      if (index < 0) this.selectedId_.push(id);
    }
  }

  itemMouseLeave(id: string) {
    const move = this.itemMouseEnterFn(id);
    if (move) {
      var index = this.selectedId_.indexOf(id);
      if (index > -1) this.selectedId_.splice(index, 1);
    }
  }

  listItemDelClick(listId: string, itemId: string) {
    this.confirmDialog_ = new ConfirmDialog();
    this.confirmDialog_.cancelFn = () => {
      this.confirmDialog_ = null;
    };
    this.confirmDialog_.content = "确定删除该模型配置";
    this.confirmDialog_.okFn = () => {
      if (this.model.event) {
        this.model.event(EventType.ListItemDel, listId, itemId);
        this.confirmDialog_ = null;
      }
    };
  }

  //列表项点击事件
  itemClick(id: string) {
    var index = this.selectedId_.indexOf(id);
    if (index < 0) this.selectedId_.push(id);
    else this.selectedId_.splice(index, 1);
  }

  //列表全选
  selectAll(): void {
    this.selectedId_ = [];
    this.model.listPanel.map((l) => {
      this.selectedId_.push(l.id);
    });
  }

  //列表反选
  selectInvert(): void {
    this.model.listPanel.map((l) => {
      this.itemClick(l.id);
    });
  }

  //取消列表选中项
  selectCancel(): void {
    this.selectedId_ = [];
  }

  toCopy(cardListPanel: CardListPanel) {
    return cardListPanel.barBody && cardListPanel.barBody.length;
  }
}
