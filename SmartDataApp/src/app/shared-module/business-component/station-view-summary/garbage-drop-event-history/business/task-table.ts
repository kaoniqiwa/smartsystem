import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { IConverter } from "../../../../../common/interface/IConverter";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../custom-table/custom-table-event";
import {
  CustomTableArgs,
  FootArgs,
  GalleryTdAttr,
  OrderByEnum,
  TableAttr,
  TableOperationBtn,
} from "../../../../custom-table/custom-table-model";
import { CameraImageUrl } from "../../../../../data-core/model/waste-regulation/event-record";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { GarbageDropEventRecord } from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { DivisionType, EventType } from "../../../../../data-core/model/enum";
import { DatePipe } from "@angular/common";
import { ImgTypeEnum, TypeNameEnum, HWCameraImageUrl } from "./camera-img-url";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { Language } from "src/app/common/tool/language";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { EventEmitter } from "@angular/core";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { IViewModel } from "src/app/common/abstract/base-view";
import { GarbageTaskNumberData } from "src/app/waste-regulation-system/index/business-card-grid/business/garbage-task-number/garbage-task-number-data";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";

export class TaskStationTable extends BusinessTable implements IConverter {
  dataSource = new CustomTableArgs<any>({
    hasTableOperationTd: false,
    hasHead: true,
    isSingleElection: true,
    disableSelect: true,
    values: [],
    primaryKey: "id",
    eventDelegate: (event: CustomTableEvent) => {
      if (event.eventType == CustomTableEventEnum.asOrder) {
        const data = event.data as { asOrderBy: number; id: string },
          toOrder = (orderName: TaskTableHeader) => {
            this.dataSource.values = this.dataSource.values.sort((a, b) => {
              if (data.asOrderBy == OrderByEnum.up)
                return String.naturalCompare(
                  a[orderName].toString(),
                  b[orderName].toString()
                );
              else
                return String.naturalCompare(
                  b[orderName].toString(),
                  a[orderName].toString()
                );
            });
          };
        toOrder(data.id as TaskTableHeader);
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: this.GetColumeName(GlobalStoreService.divisionType),
        tdWidth: "15%",
        tdInnerAttrName: TaskTableHeader.name,
        orderBy: {
          asOrderBy: 1,
          id: TaskTableHeader.id,
        },
      }),
      new TableAttr({
        HeadTitleName: "全部任务",
        tdWidth: "10%",
        tdInnerAttrName: TaskTableHeader.total,
        className: "blue-text",
        orderBy: {
          asOrderBy: 0,
          id: TaskTableHeader.total,
        },
      }),
      new TableAttr({
        HeadTitleName: "未完成任务",
        tdWidth: "10%",
        tdInnerAttrName: TaskTableHeader.unhandle,
        className: "powder-red-text",
        orderBy: {
          asOrderBy: 0,
          id: TaskTableHeader.unhandle,
        },
      }),
      new TableAttr({
        HeadTitleName: "超时处置",
        tdWidth: "10%",
        tdInnerAttrName: TaskTableHeader.timeout,
        className: "orange-text",
        orderBy: {
          asOrderBy: 0,
          id: TaskTableHeader.timeout,
        },
      }),

      new TableAttr({
        HeadTitleName: "处置率",
        tdWidth: "10%",
        tdInnerAttrName: TaskTableHeader.ratio,
        fixedWidth: "72px",
        className: "sky-blue-text2",
        orderBy: {
          asOrderBy: 0,
          id: TaskTableHeader.ratio,
        },
      }),
    ],
    footArgs: new FootArgs({
      hasSelectBtn: false,
      hasSelectCount: false,
    }),
  });

  dataCount = {
    name: "",
    total: 0,
    unhandle: 0,

    timeout: 0,
    ratio: "100%",
  };

  getDivision: (id: string) => Division;
  getGarbageStation: (id: string) => GarbageStation;

  constructor(private datePipe: DatePipe) {
    super();
  }

  Convert(
    input: GarbageStationNumberStatisticBusinessData,
    output: CustomTableArgs<TaskTableField>
  ) {
    const items = new Array<TaskTableField>();
    for (const item of input.items) {
      let field = this.toTableModel(item);
      items.push(field);
    }
    output.values = items;
    return output;
  }

  toTableModel(data: GarbageTaskNumberData) {
    const tableField = new TaskTableField();
    tableField.id = data.Id;
    tableField.name = data.Name;

    tableField.total = data.GarbageDropCount || 0;
    tableField.timeout = data.GarbageDropTimeoutCount || 0;
    tableField.handle = data.CompleteTaskCount || 0;
    tableField.unhandle =
      data.GarbageDropCount - data.GarbageDropHandleCount || 0;
    tableField.ratio = "100.00%";
    let ratio = (data.GarbageDropHandleCount / data.GarbageDropCount) * 100;
    if (!Number.isNaN(ratio)) tableField.ratio = ratio.toFixed(2) + "%";
    return tableField;
  }

  GetColumeName(type: DivisionType) {
    switch (type) {
      case DivisionType.Committees:
        return Language.json.station;
      case DivisionType.County:
        return Language.json.DivisionType.Committees;
      case DivisionType.City:
        return Language.json.DivisionType.County;
      default:
        break;
    }
  }
}

export class GarbageStationNumberStatisticBusinessData
  implements IBusinessData
{
  items: Array<GarbageTaskNumberData>;
}

export class TaskTableField implements ITableField {
  id: string;
  name: string;
  total: number;
  unhandle: number;
  handle: number;
  timeout: number;
  ratio: string;
}

enum TaskTableHeader {
  id = "id",
  name = "name",
  total = "total",

  unhandle = "unhandle",
  handle = "handle",
  timeout = "timeout",
  ratio = "ratio",
}
