import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { CustomTableArgs, TableOperationBtn } from "./custom-table-model";
import { CustomTableEvent, CustomTableEventEnum } from "./custom-table-event";
import { IBusinessData } from "../../common/interface/IBusiness";
import { ColorEnum } from "../card-component/card-content-factory";
import { TableAttr, OrderByEnum } from "./custom-table-model";
import {
  mousewheel,
  scrollLeft,
} from "../../common/tool/jquery-help/jquery-help";
@Component({
  selector: "hw-custom-table",
  templateUrl: "./custom-table.component.html",
  styleUrls: ["./custom-table.component.styl"],
})
export class CustomTableComponent implements OnInit {
  // @ViewChild('customTable', { read: InfiniteScrollDirective })
  // scrollBar: InfiniteScrollDirective;
  //注入表格的参数对象
  @Input() model: CustomTableArgs<IBusinessData>;

  // 点击表格栏目
  @Output() selectedEvent = new EventEmitter<string[]>();

  // 切换页码
  @Output() changePageEvent = new EventEmitter<number>();

  // 点击操作栏按钮
  @Output() operateEvent = new EventEmitter();

  //已选中id
  selectedId: string[] = [];

  minusTableHeightStr = "0px";

  ngOnInit() {
    let tableHeight = 0;
    if (this.model.hasHead) {
      tableHeight += 70;
    }
    if (this.model.hasFoot) {
      tableHeight += 42;
    }
    this.minusTableHeightStr = tableHeight + "px";
  }

  tdImgListScoll() {
    setTimeout(() => {
      var leftNumber = 0;
      mousewheel(
        ".hw-wheel",
        (
          thatDom: { offsetWidth: number },
          d: { originalEvent: { wheelDelta: number } }
        ) => {
          if (d.originalEvent && d.originalEvent.wheelDelta > 0)
            leftNumber -= 54;
          else if (d.originalEvent && d.originalEvent.wheelDelta < 0)
            leftNumber += 54;
          leftNumber = leftNumber < 0 ? 0 : leftNumber;
          leftNumber =
            leftNumber > thatDom.offsetWidth ? thatDom.offsetWidth : leftNumber;
          console.log(leftNumber);
          scrollLeft(thatDom, leftNumber);
        }
      );
    }, 1000);
  }

  tdIconClassLabel(val: string) {
    const item: { tdVal: string; iconClass: string; label: string } =
      JSON.parse(val);
    return item;
  }

  iconTdAttr(id: string) {
    const item = this.model.iconTd.find((x) => x.key == id);
    return item.icons;
  }

  galleryTdAttr(id: string) {
    const item = this.model.galleryTd.find((x) => x.key == id);
    return item.imgSrc;
  }

  galleryTdAttrMaxLen(id: string) {
    const item = this.model.galleryTd.find((x) => x.key == id);
    return 54 * item.imgSrc.length;
  }

  iconTextTagAttr(id: string) {
    const item = this.model.iconTextTagAttr.find((x) => x.key == id);
    return item ? item.texts.slice(0, 4) : [];
  }
  iconTextTagAttrNum(id: string) {
    const item = this.model.iconTextTagAttr.find((x) => x.key == id);
    return item ? item.texts.length : 0;
  }

  iconTextTagAttrClick(item: IBusinessData) {
    var index = this.selectedId.indexOf(item[this.model.primaryKey]);
    if (index == -1) this.selectedId.push(item[this.model.primaryKey]);
    this.model.eventDelegate(
      new CustomTableEvent(CustomTableEventEnum.TagBtn, null)
    );
  }

  //列表全选
  selectAll(): void {
    if (this.model.isSingleElection || this.model.disableSelect) return;
    this.selectedId = [];
    for (var i = 0; i < this.model.values.length; i++) {
      if (!this.model.values[i]["DisableSelect"])
        this.selectedId.push(this.model.values[i][this.model.primaryKey]);
    }
    this.model.eventDelegate(
      new CustomTableEvent(CustomTableEventEnum.SelectAll, null)
    );
    this.selectedEvent.emit(this.selectedId);
  }

  //列表反选
  selectInvert(): void {
    if (this.model.isSingleElection || this.model.disableSelect) return;
    for (var i = 0; i < this.model.values.length; i++) {
      this.itemClick(this.model.values[i]);
    }
  }

  //取消列表选中项
  selectCancel(): void {
    this.selectedId = [];
    this.model.eventDelegate(
      new CustomTableEvent(CustomTableEventEnum.SelectCancel, null)
    );
    this.selectedEvent.emit(this.selectedId);
  }

  //列表项点击事件
  itemClick(item: IBusinessData): void {
    if (!this.model.disableSelect) {
      if (!item["DisableSelect"]) {
        var index = this.selectedId.indexOf(item[this.model.primaryKey]);
        if (index < 0) {
          if (this.model.isSingleElection) this.selectedId = [];
          this.selectedId.push(item[this.model.primaryKey]);
        } else {
          this.selectedId.splice(index, 1);
        }
      }
    }
    this.model.eventDelegate(
      new CustomTableEvent(CustomTableEventEnum.Item, item)
    );
    this.selectedEvent.emit(this.selectedId);
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
        if (selectedIndex > -1) this.selectedId.splice(selectedIndex, 1);
        if (this.model.iconTextTagAttr) {
          const attrIndex = this.model.iconTextTagAttr.findIndex(
            (x) => x.key == id
          );
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
  changePage(pageIndex: number) {
    this.selectCancel();
    // console.log("页码", pageIndex);
    this.changePageEvent.emit(pageIndex);
  }

  fontColor(text: string) {
    var className = "";
    switch (text) {
      case "正常":
        className = ColorEnum["green-text"];
        break;
      case "满溢":
        className = ColorEnum["orange-text"];
        break;
      case "异常":
        className = ColorEnum["red-text"];
        break;
      case "离线":
        className = ColorEnum["red-text"];
      default:
        break;
    }
    return className; //rgb(225,94,100)
  }

  imgClick(url: string) {
    if (this.model.isDisplayDetailImg) {
      event.stopPropagation();
      this.model.eventDelegate(
        new CustomTableEvent(CustomTableEventEnum.Img, url)
      );
    }
  }

  /**
   * 排序头事件
   * @param th
   */
  thOrderClick(th: TableAttr) {
    if (th.orderBy) {
      th.orderBy.asOrderBy =
        th.orderBy.asOrderBy == OrderByEnum.up
          ? OrderByEnum.down
          : OrderByEnum.up;
      this.model.eventDelegate(
        new CustomTableEvent(CustomTableEventEnum.asOrder, th.orderBy)
      );
    }
  }

  galleryImgClick(item: any, index: number) {
    if (this.model.isDisplayDetailImg) {
      event.stopPropagation();
      this.model.eventDelegate(
        new CustomTableEvent(CustomTableEventEnum.Img, {
          item: item,
          index: index,
        })
      );
    }
  }
  /**
   *  抛出 操作按钮类型和操作对象
   * @param btn
   * @param item
   */
  operate(btn: TableOperationBtn, item: IBusinessData) {
    this.operateEvent.emit({
      operateType: btn.operateType,
      item,
    });
  }
}
