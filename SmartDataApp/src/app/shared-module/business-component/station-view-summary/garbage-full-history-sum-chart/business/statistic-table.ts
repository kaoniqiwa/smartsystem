import { IConverter } from "../../../../../common/interface/IConverter";
import { GarbageStationNumberStatisticV2 } from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
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
import { EventNumber } from "../../../../../data-core/model/waste-regulation/event-number";
import { EventType } from "../../../../../data-core/model/enum";
import {
  IntegerDecimalNum,
  ToHoursMinutes,
  Percentage,
} from "../../../../../common/tool/tool.service";
import { OrderByEnum } from "../../../../custom-table/custom-table-model";
import "../../../../../common/string/hw-string";
import { Language } from "src/app/common/tool/language";
export class StatisticTable extends BusinessTable implements IConverter {
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
          toOrder = (orderName: FieldOrderNameEnum) => {
            if (orderName == null)
              this.dataSource.values = this.dataSource.values.sort((a, b) => {
                if (data.asOrderBy == OrderByEnum.up)
                  return "".naturalCompare(a.name, b.name);
                else return "".naturalCompare(b.name, a.name);
              });
            else
              this.dataSource.values = this.dataSource.values.sort((a, b) => {
                const o1: { tdNumber: number } = JSON.parse(a[orderName]),
                  o2: { tdNumber: number } = JSON.parse(b[orderName]);
                if (data.asOrderBy == OrderByEnum.up)
                  return o1.tdNumber - o2.tdNumber;
                else return o2.tdNumber - o1.tdNumber;
              });
          };
        toOrder(data.id as FieldOrderNameEnum);
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: "名称",
        tdWidth: "17.8%",
        tdInnerAttrName: "name",
        orderBy: {
          asOrderBy: 0,
          id: null,
        },
      }),
      new TableAttr({
        HeadTitleName: "达标率",
        tdWidth: "13.7%",
        fixedWidth: "60px",
        iocnClassLabel: true,
        orderBy: {
          asOrderBy: 1,
          id: FieldOrderNameEnum.GarbageRatio,
        },
        tdInnerAttrName: "garbageRatio",
      }),
      new TableAttr({
        HeadTitleName: "平均滞留时长",
        tdWidth: "13.7%",
        iocnClassLabel: true,
        orderBy: {
          asOrderBy: 0,
          id: FieldOrderNameEnum.AvgGarbageTime,
        },
        tdInnerAttrName: "avgGarbageTime",
      }),
      new TableAttr({
        HeadTitleName: "最大滞留时长",
        tdWidth: "13.7%",
        iocnClassLabel: true,
        orderBy: {
          asOrderBy: 0,
          id: FieldOrderNameEnum.MaxGarbageTime,
        },
        tdInnerAttrName: "maxGarbageTime",
      }),
      new TableAttr({
        HeadTitleName: "总滞留时长",
        tdWidth: "13.7%",
        iocnClassLabel: true,
        orderBy: {
          asOrderBy: 0,
          id: FieldOrderNameEnum.GarbageDuration,
        },
        tdInnerAttrName: "garbageDuration",
      }),
      new TableAttr({
        HeadTitleName: Language.json.EventType.IllegalDrop,
        tdWidth: "13.7%",
        fixedWidth: "50px",
        iocnClassLabel: true,
        orderBy: {
          asOrderBy: 0,
          id: FieldOrderNameEnum.IllegalDrop,
        },
        tdInnerAttrName: "illegalDrop",
      }),
      new TableAttr({
        HeadTitleName: Language.json.EventType.MixedInto,
        tdWidth: "13.7%",
        fixedWidth: "50px",
        iocnClassLabel: true,
        orderBy: {
          asOrderBy: 0,
          id: FieldOrderNameEnum.IllegalDrop,
        },
        tdInnerAttrName: "mixedInto",
      }),
    ],
    footArgs: new FootArgs({
      hasSelectBtn: false,
      hasSelectCount: false,
    }),
  });

  scrollPageFn: (event: CustomTableEvent) => void;

  Convert<StatisticRecord, CustomTableArgs>(
    input: StatisticRecord,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>(),
      statisticMap = new Map<string, Array<GarbageStationNumberStatisticV2>>(),
      findIllegalDrop = (e: Array<EventNumber>, type: EventType) => {
        return e.find((f) => f.EventType == type);
      },
      classList = {
        equal: "",
        lt: "mdi mdi-arrow-up-bold red-text ",
        gt: "mdi mdi-arrow-down-bold green-text ",
      },
      toHour = (val: number) => {
        const hm = ToHoursMinutes(val);
        return val > 60
          ? `${hm.hours}小时${hm.minutes}分钟`
          : hm.minutes + Language.json.Time.minute;
      },
      maxPercentage = (val: number) => {
        return val >= 1000 ? "-" : val + "%";
      };
    var tableItems: any;
    if (input instanceof StatisticRecord) {
      input.items.map((i) => {
        if (statisticMap.has(i.Id)) {
          const item = statisticMap.get(i.Id);
          item.push(i);
          item.sort((a, b) => {
            if (a.Time.Week && b.Time.Week) return a.Time.Week - b.Time.Week;
            else if (a.Time.Day && b.Time.Day) return a.Time.Day - b.Time.Day;
            else if (a.Time.Month && b.Time.Month)
              return a.Time.Month - b.Time.Month;
          });
          statisticMap.set(i.Id, item);
        } else statisticMap.set(i.Id, [i]);
      });

      for (const v of statisticMap.keys()) {
        const item = statisticMap.get(v),
          tf = new TableField(); //console.log(item);

        if (item.length >= 2) {
          items.push(tf);
          tf.name = item[1].Name;
          var fd = new FieldDesc();
          fd.label = IntegerDecimalNum(
            Math.abs(item[0].GarbageRatio - item[1].GarbageRatio) + ""
          );
          fd.tdVal = IntegerDecimalNum(item[1].GarbageRatio + "");
          fd.tdNumber = item[1].GarbageRatio;
          // fd.iconClass =
          //   item[0].GarbageRatio < item[1].GarbageRatio ? upClass : downClass;
          fd.setIconClass(
            item[0].GarbageRatio,
            item[1].GarbageRatio,
            classList
          );
          tf.garbageRatio = JSON.stringify(fd);

          fd = new FieldDesc();
          fd.label = maxPercentage(
            Percentage(
              item[1].AvgGarbageTime,
              item[0].AvgGarbageTime + item[1].AvgGarbageTime
            )
          );
          fd.tdVal =
            item[1].AvgGarbageTime == 0 ? "0" : toHour(item[1].AvgGarbageTime);
          fd.tdNumber = item[1].AvgGarbageTime;
          // fd.iconClass =
          //   item[0].AvgGarbageTime < item[1].AvgGarbageTime
          //     ? upClass
          //     : downClass;
          fd.setIconClass(
            item[0].AvgGarbageTime,
            item[1].AvgGarbageTime,
            classList
          );
          tf.avgGarbageTime = JSON.stringify(fd);

          fd = new FieldDesc();
          fd.label = maxPercentage(
            Percentage(
              item[1].MaxGarbageTime,
              item[0].MaxGarbageTime + item[1].MaxGarbageTime
            )
          );
          fd.tdVal =
            item[1].MaxGarbageTime == 0 ? "0" : toHour(item[1].MaxGarbageTime);
          fd.tdNumber = item[1].MaxGarbageTime;
          // fd.iconClass =
          //   item[0].MaxGarbageTime < item[1].MaxGarbageTime
          //     ? upClass
          //     : downClass;
          fd.setIconClass(
            item[0].MaxGarbageTime,
            item[1].MaxGarbageTime,
            classList
          );
          tf.maxGarbageTime = JSON.stringify(fd);

          fd = new FieldDesc();
          fd.label = maxPercentage(
            Percentage(
              item[1].GarbageDuration,
              item[0].GarbageDuration + item[0].GarbageDuration
            )
          );
          fd.tdVal =
            item[1].GarbageDuration == 0
              ? "0"
              : toHour(item[1].GarbageDuration);
          fd.tdNumber = item[1].GarbageDuration;
          // fd.iconClass =
          //   item[0].GarbageDuration < item[1].GarbageDuration
          //     ? upClass
          //     : downClass;
          fd.setIconClass(
            item[0].GarbageDuration,
            item[1].GarbageDuration,
            classList
          );
          tf.garbageDuration = JSON.stringify(fd);

          if (
            findIllegalDrop(item[0].EventNumbers, EventType.IllegalDrop) &&
            findIllegalDrop(item[1].EventNumbers, EventType.IllegalDrop)
          ) {
            fd = new FieldDesc();
            fd.label = maxPercentage(
              Percentage(
                findIllegalDrop(item[1].EventNumbers, EventType.IllegalDrop)
                  .DayNumber,
                findIllegalDrop(item[0].EventNumbers, EventType.IllegalDrop)
                  .DayNumber +
                  findIllegalDrop(item[0].EventNumbers, EventType.IllegalDrop)
                    .DayNumber
              )
            );

            fd.tdVal =
              findIllegalDrop(item[1].EventNumbers, EventType.IllegalDrop)
                .DayNumber == 0
                ? "0"
                : findIllegalDrop(item[1].EventNumbers, EventType.IllegalDrop)
                    .DayNumber + "";
            fd.tdNumber = findIllegalDrop(
              item[1].EventNumbers,
              EventType.IllegalDrop
            ).DayNumber;
            // fd.iconClass =
            //   findIllegalDrop(item[0].EventNumbers, EventType.IllegalDrop)
            //     .DayNumber <
            //   findIllegalDrop(item[1].EventNumbers, EventType.IllegalDrop)
            //     .DayNumber
            //     ? upClass
            //     : downClass;
            fd.setIconClass(
              findIllegalDrop(item[0].EventNumbers, EventType.IllegalDrop)
                .DayNumber,
              findIllegalDrop(item[1].EventNumbers, EventType.IllegalDrop)
                .DayNumber,
              classList
            );
            tf.illegalDrop = JSON.stringify(fd);
          }
          if (
            findIllegalDrop(item[0].EventNumbers, EventType.MixedInto) &&
            findIllegalDrop(item[1].EventNumbers, EventType.MixedInto)
          ) {
            fd = new FieldDesc();
            fd.label = maxPercentage(
              Percentage(
                findIllegalDrop(item[1].EventNumbers, EventType.MixedInto)
                  .DayNumber,
                findIllegalDrop(item[0].EventNumbers, EventType.MixedInto)
                  .DayNumber +
                  findIllegalDrop(item[0].EventNumbers, EventType.MixedInto)
                    .DayNumber
              )
            );

            fd.tdVal =
              findIllegalDrop(item[1].EventNumbers, EventType.MixedInto)
                .DayNumber == 0
                ? "0"
                : findIllegalDrop(item[1].EventNumbers, EventType.MixedInto)
                    .DayNumber + "";
            fd.tdNumber = findIllegalDrop(
              item[1].EventNumbers,
              EventType.MixedInto
            ).DayNumber;
            // fd.iconClass =
            //   findIllegalDrop(item[0].EventNumbers, EventType.MixedInto)
            //     .DayNumber <
            //   findIllegalDrop(item[1].EventNumbers, EventType.MixedInto)
            //     .DayNumber
            //     ? upClass
            //     : downClass;
            fd.setIconClass(
              findIllegalDrop(item[0].EventNumbers, EventType.MixedInto)
                .DayNumber,
              findIllegalDrop(item[1].EventNumbers, EventType.MixedInto)
                .DayNumber,
              classList
            );
            tf.mixedInto = JSON.stringify(fd);
          }
        }
      }

      tableItems = items.sort((a, b) => {
        const ratio1: { tdVal: string } = JSON.parse(a.garbageRatio),
          ratio2: { tdVal: string } = JSON.parse(b.garbageRatio);

        return parseFloat(ratio1.tdVal) - parseFloat(ratio2.tdVal);
      });
    }

    if (output instanceof CustomTableArgs) output.values = tableItems;
    return output;
  }
}

export class StatisticRecord implements IBusinessData {
  items: GarbageStationNumberStatisticV2[];
}

export class TableField implements ITableField {
  id: string;
  name: string;
  garbageRatio: string;
  avgGarbageTime: string;
  maxGarbageTime: string;
  garbageDuration: string;
  illegalDrop: string;
  mixedInto: string;
}

export class FieldDesc {
  tdVal: string;
  iconClass: string;
  setIconClass(
    compareA: number,
    compareB: number,
    classList: { equal: string; lt: string; gt: string }
  ) {
    if (compareA === compareB) {
      this.iconClass = classList.equal;
    } else if (compareA < compareB) {
      this.iconClass = classList.lt;
    } else {
      this.iconClass = classList.gt;
    }
  }
  label: string;
  tdNumber: number;
}

export enum FieldOrderNameEnum {
  GarbageRatio = "garbageRatio",
  AvgGarbageTime = "avgGarbageTime",
  MaxGarbageTime = "maxGarbageTime",
  GarbageDuration = "garbageDuration",
  IllegalDrop = "illegalDrop",
  MixedInto = "mixedInto",
}
