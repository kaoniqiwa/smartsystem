import { IConverter } from "../../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { Camera } from "../../../../../data-core/model/aiop/camera";
import {
  CustomTableArgs,
  TableAttr,
  TableOperationBtn,
  TableIconTextTagAttr,
  TableTh,
} from "../../../../../shared-module/custom-table/custom-table-model";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../../shared-module/custom-table/custom-table-event";
import { TableFormControl } from "../../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../../common/interface/IPageTable";
import { EncodeDevice } from "../../../../../data-core/model/aiop/encode-device";
import { ResourcesTable } from "../../../../common/resources-table";
import { ITableField } from "../../../../common/ITableField";
import { FormGroup, FormControl } from "@angular/forms";
import { Language } from "../../../../../common/tool/language";
export class CameraTable
  extends ResourcesTable
  implements IConverter, IPageTable<Camera>
{
  dataSource = new CustomTableArgs<TableField>({
    hasTableOperationTd: true,
    hasHead: true,
    isSingleElection: false,
    values: [],
    primaryKey: "id",
    eventDelegate: (event: CustomTableEvent) => {
      if (event.eventType == CustomTableEventEnum.ScrollDown)
        this.scrollPageFn(event);
      else if (event.eventType == CustomTableEventEnum.TagBtn)
        if (this.attrBtnFn) this.attrBtnFn();
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: "名称",
        tdWidth: "25%",
        tdInnerAttrName: "name",
      }),
      new TableAttr({
        HeadTitleName: "类型",
        tdWidth: "10%",
        tdInnerAttrName: "cameraType",
      }),
      new TableAttr({
        HeadTitleName: "状态",
        tdWidth: "10%",
        tdInnerAttrName: "cameraState",
      }),
      new TableAttr({
        HeadTitleName: "编码设备",
        tdWidth: "15%",
        tdInnerAttrName: "encodeDevice",
      }),
    ],
    iconTextTh: new TableTh("30%", "标签"),
    iconTextTagAttr: [],
    tableOperationBtns: [
      new TableOperationBtn({
        css: "howell-icon-modification td-icon",
        title: "编辑",
        callback: (item: TableField) => {
          this.form.show = true;
          this.form.editItem = this.findItemFn(item.id);
        },
      }),
    ],
  });
  updateItemFn: (item: Camera) => void;
  addItemFn: (item: Camera) => void;
  findItemFn: (id: string) => Camera;
  findDeviceFn: (id: string) => EncodeDevice;
  delItemFn: (id: string) => void;
  scrollPageFn: (event: CustomTableEvent) => void;
  form = new TableFormControl<Camera>(this);
  constructor() {
    super();
    this.searchform = new FormGroup({
      Name: new FormControl(""),
      EncodeDeviceId: new FormControl(""),
      CameraType: new FormControl(""),
      SearchText: new FormControl(""),
    });
  }

  Convert<Cameras, CustomTableArgs>(input: Cameras, output: CustomTableArgs) {
    const items = new Array<TableField>();
    const tagsAttr = new Array<TableIconTextTagAttr>();
    if (input instanceof Cameras) {
      for (const item of input.items) {
        items.push(this.toTableModel(item));
        const tagAttr = new TableIconTextTagAttr();
        tagAttr.key = item.Id;
        item.Labels.map((l) => {
          tagAttr.texts.push({ id: l.Id, label: l.Name });
        });
        tagsAttr.push(tagAttr);
      }
    }
    if (output instanceof CustomTableArgs) {
      output.values = [...output.values, ...items];
      output.iconTextTagAttr = [...output.iconTextTagAttr, ...tagsAttr];
    }
    return output;
  }

  singleConvert(item: Camera) {
    this.dataSource.values.push(this.toTableModel(item));
    const tagAttr = new TableIconTextTagAttr();
    tagAttr.key = item.Id;
    item.Labels.map((l) => {
      tagAttr.texts.push({ id: l.Id, label: l.Name });
    });
    this.dataSource.iconTextTagAttr.push(tagAttr);
  }

  addItem(item: Camera) {
    this.singleConvert(item);
    this.addItemFn(item);
    this.dataSource.footArgs.totalRecordCount += 1;
  }

  editItem(item: Camera) {
    this.updateItemFn(item);
    const findVal = this.dataSource.values.find((x) => x.id == item.Id);
    findVal.name = item.Name;
    findVal.channelNo = item.ChannelNo + "";
    findVal.cameraType = Language.CameraType(item.CameraType);
    const dev = this.findDeviceFn(item.EncodeDeviceId);
    if (dev) findVal.encodeDevice = dev.Name;
    const findTag = this.dataSource.iconTextTagAttr.find(
      (x) => x.key == item.Id
    );
    findTag.texts = new Array();
    item.Labels.map((l) => {
      findTag.texts.push({ id: l.Id, label: l.Name });
    });
  }

  toTableModel(item: Camera) {
    let tableField = new TableField();
    tableField.id = item.Id;
    tableField.name = item.Name;
    tableField.channelNo = item.ChannelNo + "";
    tableField.cameraState = Language.CameraState(item.CameraState) || "-";
    tableField.cameraType = Language.CameraType(item.CameraType);
    const dev = this.findDeviceFn(item.EncodeDeviceId);
    if (dev) tableField.encodeDevice = dev.Name;
    return tableField;
  }
}

export class Cameras implements IBusinessData {
  items: Camera[];
}

export class TableField implements ITableField {
  id: string;
  name: string;
  cameraType: string;
  cameraState: string;
  encodeDevice: string;
  channelNo: string;
}
