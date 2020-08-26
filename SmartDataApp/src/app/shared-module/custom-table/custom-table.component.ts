import { Component, OnInit, Input, ViewChild,OnChanges } from '@angular/core';
import { CustomTableArgs } from './custom-table-model';
import { CustomTableEvent, CustomTableEventEnum } from "./custom-table-event";
import { IBusinessData } from '../../common/Interface/IBusiness';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { HWPaginationOptions } from "../../common/directive/pagination-directive";
@Component({
  selector: 'hw-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.styl'],
})
export class CustomTableComponent implements OnInit ,OnChanges{

  @ViewChild('customTable', { read: InfiniteScrollDirective })
  scrollBar: InfiniteScrollDirective;
  //注入表格的参数对象
  @Input() model: CustomTableArgs<IBusinessData>;

  //已选中id
  selectedId: string[] = [];

  minusTableHeightStr = "0px";
  paginationOptions: HWPaginationOptions;
  ngOnInit() {
    let tableHeight = 0;
    if (this.model.hasHead) {
      tableHeight += 70;
    }
    if (this.model.hasFoot) {
      tableHeight += 30;
    }
    this.minusTableHeightStr = tableHeight + "px";
  
  }
  ngOnChanges(){
    if (this.model&&this.paginationOptions==null)
    this.paginationOptions = new HWPaginationOptions(this.model.footArgs.pageCount, (index) => {
      this.model.eventDelegate(new CustomTableEvent(CustomTableEventEnum.ScrollDown, index));
    });
  }

  iconTextTagAttr(id: string) {
    const item = this.model.iconTextTagAttr.find(x => x.key == id);
    return item ? item.texts.slice(0, 4) : [];
  }
  iconTextTagAttrNum(id: string) {
    const item = this.model.iconTextTagAttr.find(x => x.key == id);
    return item ? item.texts.length : 0;
  }

  iconTextTagAttrClick(item: IBusinessData) {
    var index = this.selectedId.indexOf(item[this.model.primaryKey]);
    if (index == -1)
      this.selectedId.push(item[this.model.primaryKey]);
    this.model.eventDelegate(new CustomTableEvent(CustomTableEventEnum.TagBtn, null));
  }

  //列表全选
  selectAll(): void {
    if (this.model.isSingleElection || this.model.disableSelect)
      return;
    this.selectedId = [];
    for (var i = 0; i < this.model.values.length; i++) {
      if (!this.model.values[i]['DisableSelect'])
        this.selectedId.push(this.model.values[i][this.model.primaryKey]);
    }
    this.model.eventDelegate(new CustomTableEvent(CustomTableEventEnum.SelectAll, null));
  }

  //列表反选
  selectInvert(): void {
    if (this.model.isSingleElection || this.model.disableSelect)
      return;
    for (var i = 0; i < this.model.values.length; i++) {
      this.itemClick(this.model.values[i]);
    }
  }

  //取消列表选中项
  selectCancel(): void {
    this.selectedId = [];
    this.model.eventDelegate(new CustomTableEvent(CustomTableEventEnum.SelectCancel, null));
  }

  //列表项点击事件
  itemClick(item: IBusinessData): void {
    if (!this.model.disableSelect) {
      if (!item['DisableSelect']) {
        var index = this.selectedId.indexOf(item[this.model.primaryKey]);
        if (index < 0) {
          if (this.model.isSingleElection)
            this.selectedId = [];
          this.selectedId.push(item[this.model.primaryKey]);
        }
        else {
          this.selectedId.splice(index, 1);
        }
      }
    }
    this.model.eventDelegate(new CustomTableEvent(CustomTableEventEnum.Item, item));
  }

  //添加列表项
  addListItem(item: any): void {
    this.model.values.push(item);
  }

  //删除列表项
  deleteListItem(id: string): void {
    for (var i = 0; i < this.model.values.length; i++) {
      if (id == this.model.values[i][this.model.primaryKey]) {
        const index = this.model.values.indexOf(this.model.values[i]);
        this.model.values.splice(index, 1);
        const selectedIndex = this.selectedId.indexOf(id);
        if (selectedIndex > -1)
          this.selectedId.splice(selectedIndex, 1);
        if (this.model.iconTextTagAttr) {
          const attrIndex = this.model.iconTextTagAttr.findIndex(x => x.key == id);
          if (attrIndex > -1) this.model.iconTextTagAttr.splice(attrIndex, 1);
        }
        break;
      }
    }
  }

  //更新列表
  updateList(modes: any[]): void {
    this.selectedId = [];
    this.model.values = modes;
  }

  //还原滚动条页数
  // clearScrollDownCount() {
  //   this.scrollDownCount = 1;
  //   if (this.scrollBar) {
  //     this.scrollBar.destroyScroller();
  //     this.scrollBar.setup();
  //   }
  // }

  //鼠标滚到底事件
  onScrollDown() {



  }

  imgClick(url: string) {
    if (this.model.isDisplayDetailImg) {
      event.stopPropagation();
      this.model.eventDelegate(new CustomTableEvent(CustomTableEventEnum.Img, url));

    }
  }
}