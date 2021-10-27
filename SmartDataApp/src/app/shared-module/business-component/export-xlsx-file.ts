import {
  FieldDesc,
  TableField,
} from "./station-view-summary/garbage-full-history-sum-chart/business/statistic-table";
import { HowellExcelJS } from "../../common/tool/hw-excel-js/hw-excel";

export interface IXlsxFieldVal {}

abstract class HWExportXlsxStrategy {
  abstract export(title: string, fieldVal: IXlsxFieldVal): void;
}
export class HWXlsxContext {
  private _strategy: HWExportXlsxStrategy;
  private _title: string;
  private _fieldVal: IXlsxFieldVal;

  constructor(strategy: HWExportXlsxStrategy) {
    this._strategy = strategy;
  }

  set title(val: string) {
    this._title = val;
  }

  set fieldVal(val: IXlsxFieldVal) {
    this._fieldVal = val;
  }

  export() {
    this._strategy.export(this._title, this._fieldVal);
  }
}

export class StationSumHistoryXlsx extends HWExportXlsxStrategy {
  export(title: string, fieldVal: IXlsxFieldVal) {
    let excel = new HowellExcelJS(),
      book = excel.createBook(),
      sheet = excel.addWorksheet(book, title),
      colName = ["A", "B", "C", "D", "E", "F", "G", "H"],
      fieldName = [
        "序号",
        "名称",
        "达标率",
        "平均滞留时长",
        "最大滞留时长",
        "总滞留时长",
        "乱丢垃圾",
        "混合投放",
      ],
      toCellValue = (fieldStr: string) => {
        const field: FieldDesc = JSON.parse(fieldStr);
        var value = "";
        if (field.tdVal == "0") return "0";
        else {
          value += field.tdVal;
          value +=
            field.iconClass.indexOf("up") > -1
              ? "↑" + field.label
              : "↓" + field.label;
        }
        return value;
      };

    var no = 1,
      tag = 3;
    excel.setCellValue(sheet, "A1", title);
    for (let i = 0; i < fieldName.length; i++)
      excel.setCellValue(sheet, colName[i] + "2", fieldName[i]);

    (fieldVal as Array<TableField>).map((v: TableField) => {
      if (v.garbageRatio) {
        excel.setCellValue(sheet, colName[0] + (tag + ""), no);
        excel.setCellValue(sheet, colName[1] + (tag + ""), v.name);
        excel.setCellValue(
          sheet,
          colName[2] + (tag + ""),
          toCellValue(v.garbageRatio)
        );
        excel.setCellValue(
          sheet,
          colName[3] + (tag + ""),
          toCellValue(v.avgGarbageTime)
        );
        excel.setCellValue(
          sheet,
          colName[4] + (tag + ""),
          toCellValue(v.maxGarbageTime)
        );
        excel.setCellValue(
          sheet,
          colName[5] + (tag + ""),
          toCellValue(v.garbageDuration)
        );
        excel.setCellValue(
          sheet,
          colName[6] + (tag + ""),
          toCellValue(v.illegalDrop)
        );
        excel.setCellValue(
          sheet,
          colName[7] + (tag + ""),
          toCellValue(v.mixedInto)
        );
        no += 1;
        tag += 1;
      }
    });
    excel.writeFile(book, title);
  }
}
