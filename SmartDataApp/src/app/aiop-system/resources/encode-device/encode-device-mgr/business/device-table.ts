import { IConverter } from "../../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { EncodeDevice } from "../../../../../data-core/model/aiop/encode-device";
import {
  CustomTableArgs,
  TableAttr,
  TableOperationBtn,
  TableTh,
  TableIconTextTagAttr,
} from "../../../../../shared-module/custom-table/custom-table-model";
import { TableFormControl } from "../../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../../common/interface/IPageTable";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../../shared-module/custom-table/custom-table-event";
import { ITableField } from "../../../../common/ITableField";
import { ResourcesTable } from "../../../../common/resources-table";
import { Language } from "src/app/common/tool/language";
export class DeviceTable
  extends ResourcesTable
  implements IConverter, IPageTable<EncodeDevice>
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
        tdWidth: "22%",
        tdInnerAttrName: "name",
      }),
      new TableAttr({
        HeadTitleName: "地址",
        tdWidth: "17%",
        tdInnerAttrName: "url",
      }),
      new TableAttr({
        HeadTitleName: "协议类型",
        tdWidth: "10%",
        tdInnerAttrName: "protocolType",
      }),
      new TableAttr({
        HeadTitleName: Language.json.state,
        tdWidth: "7%",
        tdInnerAttrName: "onlineStatus",
      }),
      new TableAttr({
        HeadTitleName: "设备类型",
        tdWidth: "10%",
        tdInnerAttrName: "deviceType",
      }),
    ],
    iconTextTh: new TableTh("27%", "标签"),
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
  scrollPageFn: (event: CustomTableEvent) => void;
  updateItemFn: (item: EncodeDevice) => void;
  addItemFn: (item: EncodeDevice) => void;
  findItemFn: (id: string) => EncodeDevice;
  delItemFn: (id: string) => void;
  form = new TableFormControl<EncodeDevice>(this);
  constructor() {
    super();
  }

  Convert<EncodeDevices, CustomTableArgs>(
    input: EncodeDevices,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();
    const tagsAttr = new Array<TableIconTextTagAttr>();
    if (input instanceof EncodeDevices) {
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

  addItem(item: EncodeDevice) {
    this.dataSource.values.push(this.toTableModel(item));
    this.addItemFn(item);
    this.dataSource.footArgs.totalRecordCount += 1;
    const tagAttr = new TableIconTextTagAttr();
    tagAttr.key = item.Id;
    item.Labels.map((l) => {
      tagAttr.texts.push({ id: l.Id, label: l.Name });
    });
    this.dataSource.iconTextTagAttr.push(tagAttr);
  }

  singleConvert(item: EncodeDevice) {
    this.dataSource.values.push(this.toTableModel(item));
    const tagAttr = new TableIconTextTagAttr();
    tagAttr.key = item.Id;
    item.Labels.map((l) => {
      tagAttr.texts.push({ id: l.Id, label: l.Name });
    });
    this.dataSource.iconTextTagAttr.push(tagAttr);
  }

  editItem(item: EncodeDevice) {
    const findVal = this.dataSource.values.find((x) => x.id == item.Id);
    findVal.name = item.Name;
    if (item.TransType == 0) findVal.transType = "UDP";
    else if (item.TransType == 1) findVal.transType = "TCP";
    findVal.protocolType = item.ProtocolType;
    findVal.model = item.Model;
    findVal.url = item.Url;
    findVal.username = item.Username;
    findVal.password = item.Password;
    findVal.deviceType = item.DeviceType;
    const findTag = this.dataSource.iconTextTagAttr.find(
      (x) => x.key == item.Id
    );
    findTag.texts = new Array();
    item.Labels.map((l) => {
      findTag.texts.push({ id: l.Id, label: l.Name });
    });
  }

  toTableModel(item: EncodeDevice) {
    let tableField = new TableField();
    tableField.id = item.Id;
    tableField.name = item.Name;
    if (item.TransType == 0) tableField.transType = "UDP";
    else if (item.TransType == 1) tableField.transType = "TCP";
    tableField.protocolType = item.ProtocolType;
    tableField.onlineStatus = item.OnlineStatus == 0 ? "正常" : "离线";
    tableField.model = item.Model;
    tableField.url = item.Url;
    tableField.username = item.Username;
    tableField.password = item.Password;
    tableField.deviceType = item.DeviceType;
    return tableField;
  }
}

export class EncodeDevices implements IBusinessData {
  items: EncodeDevice[];
}

export class TableField implements ITableField {
  id: string;
  name: string;
  /**传输类型(可选)　0：UDP，1：TCP */
  transType: string;
  /**协议类型(可选) Howell，Hikvision，UniView */
  protocolType: string;
  /**状态(可选) 0-正常,1-离线 */
  onlineStatus: string;
  /**型号(可选) */
  model: string;
  /**连接地址(可选) */
  url: string;
  /**用户名(可选) */
  username: string;
  /**密码(可选) */
  password: string;
  /**设备类型(可选) NVR，IPC，DVS */
  deviceType: string;
}
