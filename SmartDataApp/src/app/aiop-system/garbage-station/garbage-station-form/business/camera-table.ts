import { FormControl, FormGroup } from "@angular/forms";
import { ITableField } from "src/app/aiop-system/common/ITableField";
import { ResourcesTable } from "src/app/aiop-system/common/resources-table";
import { IBusinessData } from "src/app/common/interface/IBusiness";
import { IConverter } from "src/app/common/interface/IConverter";
import { IPageTable } from "src/app/common/interface/IPageTable";
import { Language } from "src/app/common/tool/language";
import { TableFormControl } from "src/app/common/tool/table-form-helper";
import { Camera as AiopCamera } from "src/app/data-core/model/aiop/camera";
import { Camera as CameraModel } from "src/app/data-core/model/waste-regulation/camera";
import { EncodeDevice } from "src/app/data-core/model/aiop/encode-device";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "src/app/shared-module/custom-table/custom-table-event";
import {
  CustomTableArgs,
  TableAttr,
  TableIconTextTagAttr,
  TableOperationBtn,
  TableTh,
} from "src/app/shared-module/custom-table/custom-table-model";
import {
  CameraTableField,
  CameraTableFiled2,
} from "../model/garbage-station-form.model";

export class CameraTable
  extends ResourcesTable
  implements IPageTable<AiopCamera>
{
  dataSource = new CustomTableArgs<TableField>({
    hasTableOperationTd: false,
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
        tdWidth: "25%",
        tdInnerAttrName: "cameraType",
      }),
      new TableAttr({
        HeadTitleName: "编码设备",
        tdWidth: "25%",
        tdInnerAttrName: "encodeDevice",
      }),
    ],
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
  encodedDeviceArr: EncodeDevice[] = [];

  updateItemFn: (item: AiopCamera) => void;
  addItemFn: (item: AiopCamera) => void;
  findItemFn: (id: string) => AiopCamera;
  findDeviceFn: (id: string) => EncodeDevice;
  delItemFn: (id: string) => void;
  scrollPageFn: (event: CustomTableEvent) => void;
  form = new TableFormControl<AiopCamera>(this);
  constructor() {
    super();
  }

  cameraToTableField(
    cameras: AiopCamera[],
    output: CustomTableArgs<CameraTableField>
  ) {
    const tableFieldArr = new Array<CameraTableField>();
    const tagsAttr = new Array<TableIconTextTagAttr>();
    for (const camera of cameras) {
      let cameraTableField: CameraTableField = {
        id: camera.Id,
        name: camera.Name,
        cameraType: Language.CameraType(camera.CameraType),
        encodeDevice: "",
      };

      let encodedDevice = this._findDeviceById(camera.EncodeDeviceId);
      if (encodedDevice) {
        cameraTableField.encodeDevice = encodedDevice.Name;
      }

      tableFieldArr.push(cameraTableField);

      const tagAttr = new TableIconTextTagAttr();
      tagAttr.key = camera.Id;
      camera.Labels.map((l) => {
        tagAttr.texts.push({ id: l.Id, label: l.Name });
      });
      tagsAttr.push(tagAttr);
    }
    if (output instanceof CustomTableArgs) {
      output.values = [...output.values, ...tableFieldArr];
      output.iconTextTagAttr = [...output.iconTextTagAttr, ...tagsAttr];
    }
  }

  cameraToTableFieldLocal(
    cameras: CameraModel[],
    output: CustomTableArgs<CameraTableFiled2>
  ) {
    const tableFieldArr = new Array<CameraTableFiled2>();
    const tagsAttr = new Array<TableIconTextTagAttr>();
    for (const camera of cameras) {
      let cameraTableField: CameraTableFiled2 = {
        id: camera.Id,
        name: camera.Name,
        onlineStatus: camera.OnlineStatus,
        cameraUsage: camera.CameraUsage,
      };

      tableFieldArr.push(cameraTableField);
    }
    if (output instanceof CustomTableArgs) {
      output.values = [...output.values, ...tableFieldArr];
      output.iconTextTagAttr = [...output.iconTextTagAttr, ...tagsAttr];
    }
  }

  private _findDeviceById(id: string) {
    return this.encodedDeviceArr.find(
      (encodedDevice) => encodedDevice.Id == id
    );
  }

  singleConvert(item: AiopCamera) {
    this.dataSource.values.push(this.toTableModel(item));
    const tagAttr = new TableIconTextTagAttr();
    tagAttr.key = item.Id;
    item.Labels.map((l) => {
      tagAttr.texts.push({ id: l.Id, label: l.Name });
    });
    this.dataSource.iconTextTagAttr.push(tagAttr);
  }

  addItem(item: AiopCamera) {
    this.singleConvert(item);
    this.addItemFn(item);
    this.dataSource.footArgs.totalRecordCount += 1;
  }

  editItem(item: AiopCamera) {
    this.updateItemFn(item);
    const findVal = this.dataSource.values.find(
      (x) => x.id == item.Id
    ) as TableField;
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

  toTableModel(item: AiopCamera) {
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
  items: AiopCamera[];
}

export class TableField implements ITableField {
  id: string;
  name: string;
  cameraType: string;
  cameraState: string;
  encodeDevice: string;
  channelNo: string;
}
