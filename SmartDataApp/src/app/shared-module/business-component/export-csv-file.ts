import { HowellCSV } from "../../common/tool/hw-excel-js/hw-csv";
import { TITLEKEY, COLNAME } from "../../common/tool/hw-excel-js/data";
import {
  FieldDesc,
  TableField,
} from "./station-view-summary/garbage-full-history-sum-chart/business/statistic-table";

export interface ICsvFieldVal {}

abstract class HWExportCsvStrategy {
  abstract export(
    title: string,
    fieldName: Array<string>,
    fieldVal: ICsvFieldVal
  ): void;
}
export class HWCsvContext {
  private _strategy: HWExportCsvStrategy;
  private _title: string;
  private _fieldName: Array<string>;
  private _fieldVal: ICsvFieldVal;

  constructor(strategy: HWExportCsvStrategy) {
    this._strategy = strategy;
  }

  set title(val: string) {
    this._title = val;
  }

  set fieldName(val: Array<string>) {
    this._fieldName = val;
  }

  set fieldVal(val: ICsvFieldVal) {
    this._fieldVal = val;
  }

  export() {
    this._strategy.export(this._title, this._fieldName, this._fieldVal);
  }
}

export class StationSumHistoryCsv extends HWExportCsvStrategy {
  export(title: string, fieldName: Array<string>, fieldVal: ICsvFieldVal) {
    const csvDataMap = new Map<string, Array<string>>(),
      toFieldVal = (fieldStr: string) => {
        const field: FieldDesc = JSON.parse(fieldStr);
        return field.tdNumber + "";
      };
    var no = 1;
    csvDataMap.set(COLNAME, [
      "序号",
      "名称",
      "达标率",
      "平均落地时长",
      "最大落地时长",
      "总落地时长",
      "乱丢垃圾",
      "混合投放",
    ]);
    csvDataMap.set(TITLEKEY, [title]);
    (fieldVal as Array<TableField>).map((v: TableField) => {
      csvDataMap.set(no + "", [
        no + "",
        v.name,
        toFieldVal(v.garbageRatio),
        toFieldVal(v.avgGarbageTime),
        toFieldVal(v.maxGarbageTime),
        toFieldVal(v.garbageRatio),
        toFieldVal(v.illegalDrop),
        toFieldVal(v.mixedInto),
      ]);
      no += 1;
    });

    new HowellCSV(csvDataMap).writeCsvFile(title);
  }
}
