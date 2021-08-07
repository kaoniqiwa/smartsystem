import { IConverter } from "../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import {
  CustomTableArgs,
  TableAttr,
  TableOperationBtn,
} from "../../../../shared-module/custom-table/custom-table-model";
import { TableFormControl } from "../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../common/interface/IPageTable";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../shared-module/custom-table/custom-table-event";
import { ITableField } from "../../../common/ITableField";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { Injectable } from "@angular/core";
import { BusinessTable } from "../../../common/business-table";
import { Page } from "../../../../data-core/model/page";
import { DataService as StationTypeDataService } from "../../garbage-station/business/data.service";
import { DataService as DivisionStationDataService } from "../../division-station-tree/business/data-service";

@Injectable()
export class BusinessService {
  divisionStationDataService: DivisionStationDataService;
  stationTypeDataService: StationTypeDataService;
  table = new GarbageStationTable();
  constructor() {
    this.table.findItemFn = (id: string) => {
      return this.divisionStationDataService.garbageStations.find(
        (x) => x.Id == id
      );
    };
    this.table.addItemFn = (item: GarbageStation) => {
      this.divisionStationDataService.garbageStations.push(item);
    };
    this.table.updateItemFn = (item: GarbageStation) => {
      const findItem = this.divisionStationDataService.garbageStations.find(
        (x) => x.Id == item.Id
      );
      if (findItem) {
        for (var key in item) findItem[key] = item[key];
      }
    };
    this.table.findStationTypeFn = (type) => {
      debugger;
      var val = "";
      if (this.stationTypeDataService) {
        const find = this.stationTypeDataService.types.find(
          (x) => x.Type == type
        );
        if (find) val = find.Name;
      }
      return val;
    };
  }
  loadTableData(stations: GarbageStation[]) {
    this.table.clearItems();
    const list = new GarbageStations();
    list.items = stations;

    this.table.Convert(list, this.table.dataSource);
    this.table.totalCount = stations.length;

    this.table.initPagination({ PageCount: 1 } as Page, async (index) => {});
  }
}

export class GarbageStationTable
  extends BusinessTable
  implements IConverter, IPageTable<GarbageStation>
{
  dataSource = new CustomTableArgs<TableField>({
    hasTableOperationTd: true,
    hasHead: true,
    isSingleElection: false,
    values: [],
    primaryKey: "id",
    eventDelegate: (event: CustomTableEvent) => {},
    tableAttrs: [
      new TableAttr({
        HeadTitleName: "名称",
        tdWidth: "45%",
        tdInnerAttrName: "name",
      }),
      new TableAttr({
        HeadTitleName: "类型",
        tdWidth: "45%",
        tdInnerAttrName: "stationType",
      }),
    ],
    iconTextTagAttr: [],
    tableOperationBtns: [
      new TableOperationBtn({
        css: "howell-icon-modification td-icon",
        title: "编辑",
        callback: (item: TableField) => {
          debugger;
          this.form.show = true;
          this.form.editItem = this.findItemFn(item.id);
        },
      }),
    ],
  });
  scrollPageFn: (event: CustomTableEvent) => void;
  updateItemFn: (item: GarbageStation) => void;
  addItemFn: (item: GarbageStation) => void;
  findItemFn: (id: string) => GarbageStation;
  delItemFn: (id: string) => void;
  form = new TableFormControl<GarbageStation>(this);
  findStationTypeFn: (type: number) => string;
  constructor() {
    super();
  }

  Convert<GarbageStations, CustomTableArgs>(
    input: GarbageStations,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();

    if (input instanceof GarbageStations) {
      for (const item of input.items) items.push(this.toTableModel(item));
    }
    if (output instanceof CustomTableArgs) {
      output.values = [...output.values, ...items];
    }
    return output;
  }

  addItem(item: GarbageStation) {
    this.dataSource.values.push(this.toTableModel(item));
    this.addItemFn(item);
    this.dataSource.footArgs.totalRecordCount += 1;
  }

  singleConvert(item: GarbageStation) {
    this.dataSource.values.push(this.toTableModel(item));
  }

  editItem(item: GarbageStation) {
    debugger;
    const findVal = this.dataSource.values.find((x) => x.id == item.Id);
    findVal.name = item.Name;
    findVal.stationType = this.findStationTypeFn(item.StationType);
  }

  toTableModel(item: GarbageStation) {
    let tableField = new TableField();
    tableField.id = item.Id;
    tableField.name = item.Name;

    tableField.stationType = this.findStationTypeFn(item.StationType);
    return tableField;
  }
}

export class GarbageStations implements IBusinessData {
  items: GarbageStation[];
}

export class TableField implements ITableField {
  id: string;
  name: string;
  /** 类型(可选) */
  stationType: string;
}
