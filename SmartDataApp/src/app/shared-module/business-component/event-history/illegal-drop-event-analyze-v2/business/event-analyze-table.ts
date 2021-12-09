import { IConverter } from "../../../../../common/interface/IConverter";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../custom-table/custom-table-event";
import {
  CustomTableArgs,
  FootArgs,
  TableAttr,
} from "../../../../custom-table/custom-table-model";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { ClassTypeEnum } from "../../illegal-drop-event-analyze/business/search";
import "../../../../../common/string/hw-string";
import { Language } from "src/app/common/tool/language";
export class EventAnalyzeTable extends BusinessTable implements IConverter {
  findDivision: (id: string) => Division;
  findStationDivision: (id: string) => Division;
  classType: ClassTypeEnum;
  dataSource = new CustomTableArgs<any>({
    hasTableOperationTd: false,
    hasHead: true,
    isSingleElection: true,
    values: [],
    primaryKey: "id",
    isDisplayDetailImg: false,
    eventDelegate: (event: CustomTableEvent) => {
      if (event.eventType == CustomTableEventEnum.asOrder) {
        const data = event.data as { asOrderBy: number; id: string },
          toOrder = (orderName: FieldOrderNameEnum) => {
            this.dataSource.values = this.dataSource.values.sort((a, b) => {
              if (data.asOrderBy == OrderByEnum.up)
                return "".naturalCompare(a[orderName], b[orderName]);
              else return "".naturalCompare(b[orderName], a[orderName]);
            });
          };
        toOrder(data.id as FieldOrderNameEnum);
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: "名称",
        tdWidth: "30%",
        tdInnerAttrName: "name",
        orderBy: {
          asOrderBy: 0,
          id: FieldOrderNameEnum.Name,
        },
      }),
      new TableAttr({
        HeadTitleName: "行政区",
        tdWidth: "30%",
        tdInnerAttrName: "divisionName",
        orderBy: {
          asOrderBy: 0,
          id: FieldOrderNameEnum.DivisionName,
        },
      }),
      new TableAttr({
        HeadTitleName: Language.json.EventType.IllegalDrop,
        tdWidth: "30%",
        tdInnerAttrName: "eventNumber",
        orderBy: {
          asOrderBy: 1,
          id: FieldOrderNameEnum.EventNumber,
        },
      }),
    ],
    footArgs: new FootArgs({
      hasSelectBtn: false,
      hasSelectCount: false,
    }),
  });

  constructor() {
    super();
  }
  scrollPageFn: (event: CustomTableEvent) => void;

  Convert<EventsAnalyzeRecord, CustomTableArgs>(
    input: EventsAnalyzeRecord,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();

    if (input instanceof EventsAnalyzeRecord)
      for (const k of input.items.keys()) {
        const val = input.items.get(k);
        items.push(this.toTableModel(k, val.name, val.num));
      }
    if (output instanceof CustomTableArgs) output.values = items;

    return output;
  }

  toTableModel(id: string, name: string, eventNumber: number) {
    let tableField = new TableField();
    tableField.id = id;
    tableField.name = name;
    if (
      this.classType == ClassTypeEnum.Committees ||
      this.classType == ClassTypeEnum.County
    )
      tableField.divisionName = this.findDivision(id).Name;
    else if (this.classType == ClassTypeEnum.Station)
      tableField.divisionName = this.findStationDivision(id).Name;
    tableField.eventNumber = eventNumber;
    return tableField;
  }
}

export class EventsAnalyzeRecord implements IBusinessData {
  items: Map<string, { name: string; num: number }>;
}

export class TableField implements ITableField {
  id: string;
  eventNumber: number;
  name: string;
  divisionName: string;
}

export enum FieldOrderNameEnum {
  Name = "name",
  DivisionName = "divisionName",
  EventNumber = "eventNumber",
}
export enum OrderByEnum {
  up,
  down,
}
