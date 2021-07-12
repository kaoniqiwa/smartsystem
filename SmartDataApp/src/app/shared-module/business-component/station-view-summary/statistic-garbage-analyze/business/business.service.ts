import { Injectable } from "@angular/core";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import {
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticNumbersParamsV2,
} from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import {
  SearchControl,
  TimeUnitEnum,
  ChartTypeEnum,
  CategoryNameEnum,
  CategoryNameTextEnum,
} from "./search";
import { DatePipe } from "@angular/common";
import {
  OneWeekDate,
  MonthLastDay,
  OneWeekDay,
} from "../../../../../common/tool/tool.service";
import {
  BarOption,
  LineOption,
} from "../../../../../common/directive/echarts/echart";
import {
  EventNumber,
  EventType,
} from "../../../../../data-core/model/waste-regulation/event-number";
import { IntegerDecimalNum } from "../../../../../common/tool/tool.service";
import { ExcelData } from "../../../../../common/tool/hw-excel-js/data";

@Injectable()
export class BusinessService extends ListAttribute {
  search = new SearchControl(this.datePipe);
  barChartOption: BarOption;
  lineChartOption: LineOption;
  datePicker = {
    startView: 2,
    minView: 2,
    formate: "yyyy-mm-dd",
  };
  barChartView = true;
  lineChartView = false;
  reportType = "";
  dataSource: Array<GarbageStationNumberStatisticV2>;
  searchStations = new Array<{ name: string; id: string }>();
  constructor(
    private datePipe: DatePipe,
    private garbageStationService: GarbageStationRequestService
  ) {
    super();
  }

  async requestData() {
    const param = this.getRequsetParam(this.search);

    const statisticNumbers2 = await this.garbageStationService
      .statisticNumberListV2(param)
      .toPromise();
    console.log(statisticNumbers2);
    this.dataSource = statisticNumbers2.Data;
    this.searchStations = new Array();
    this.convertLineData(statisticNumbers2.Data, this.search);
    this.convertBarData(statisticNumbers2.Data, this.search);
  }
  changeChartType() {
    const param = this.search.toSearchParam();
    if (param.ChartType == ChartTypeEnum.Bar) {
      this.barChartView = true;
      this.lineChartView = false;
    } else if (param.ChartType == ChartTypeEnum.Line) {
      this.barChartView = false;
      this.lineChartView = true;
    }
  }

  /**
   *  统计数据 分组
   */
  statisticGroupBy(statistic: Array<GarbageStationNumberStatisticV2>) {
    if (statistic) {
      const groupData = new Map<
        string,
        Array<GarbageStationNumberStatisticV2>
      >();

      statistic.map((s) => {
        if (groupData.has(s.Id)) {
          const d = groupData.get(s.Id);
          d.push(s);
          groupData.set(s.Id, d);
        } else groupData.set(s.Id, [s]);
      });
      for (const key of groupData.keys()) {
        var gd = groupData.get(key);
        gd = gd.sort((a, b) => {
          return a.Time.Day - b.Time.Day;
        });
        groupData.set(key, gd);
      }
      return groupData;
    }
  }

  convertLineData(
    statistic: Array<GarbageStationNumberStatisticV2>,
    search: SearchControl
  ) {
    const s = search.toSearchParam();
    this.lineChartOption = new LineOption();
    this.lineChartOption.moreLine = true;
    this.lineChartOption.seriesLabel = null;
    this.lineChartOption.left = "0";
    this.lineChartOption.right = "0";
    this.lineChartOption.xAxisData = new Array();
    this.lineChartOption.axisLabel.formatter = (v: any) => {
      if (
        s.ClassType == CategoryNameEnum.IllegalDrop ||
        s.ClassType == CategoryNameEnum.MixedInto
      )
        return v + "起";
      else if (s.ClassType == CategoryNameEnum.GarbageRatio) return v + "分";
      else return v + "分钟";
    };

    this.lineChartOption.axisTick.show = true;
    this.lineChartOption.axisLine.show = true;
    this.lineChartOption.axisLabel.show = true;
    this.lineChartOption.label.show = false;
    if (s.TimeUnit == TimeUnitEnum.Month) {
      const lastDay = MonthLastDay(parseInt(s.Year), parseInt(s.Month));

      for (let i = 1; i <= lastDay; i++) {
        this.lineChartOption.xAxisInterval.push(i - 0);
        if (i < 10) this.lineChartOption.xAxisData.push(`0${i}日`);
        else this.lineChartOption.xAxisData.push(`${i}日`);
      }
    } else if (s.TimeUnit == TimeUnitEnum.Week) {
      this.lineChartOption.xAxisInterval = [0, 1, 2, 3, 4, 5, 6, 7];
      this.lineChartOption.xAxisData = [
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "周日",
      ];
    }
    this.lineChartOption.legendData.color = "#cfd7ff";
    this.lineChartOption.legendData.fontSize = 16;
    this.lineChartOption.legendData.right = 50;
    this.lineChartOption.legendData.orient = "vertical";
    this.lineChartOption.seriesData = new Array<{
      name: string;
      data: number[];
    }>();

    if (statistic) {
      const groupData = this.statisticGroupBy(statistic),
        findIllegalDrop = (e: Array<EventNumber>, type: EventType) => {
          return e.find((f) => f.EventType == type);
        };

      for (const key of groupData.keys()) {
        var gd = groupData.get(key),
          name = "";
        const data = new Array<string>();
        gd.map((g) => {
          if (name == "") name = g.Name;
          switch (s.ClassType) {
            case CategoryNameEnum.GarbageRatio:
              data.push(IntegerDecimalNum(g.GarbageRatio + ""));
              break;
            case CategoryNameEnum.AvgGarbageTime:
              data.push(IntegerDecimalNum(g.AvgGarbageTime + ""));
              break;
            case CategoryNameEnum.MaxGarbageTime:
              data.push(IntegerDecimalNum(g.MaxGarbageTime + ""));
              break;
            case CategoryNameEnum.GarbageDuration:
              data.push(IntegerDecimalNum(g.GarbageDuration + ""));
              break;
            case CategoryNameEnum.IllegalDrop:
              data.push(
                findIllegalDrop(g.EventNumbers, EventType.IllegalDrop)
                  .DayNumber + ""
              );
              break;
            case CategoryNameEnum.MixedInto:
              data.push(
                findIllegalDrop(g.EventNumbers, EventType.MixedInto).DayNumber +
                  ""
              );
              break;

            default:
              break;
          }
        });
        this.lineChartOption.seriesData.push({
          name: name,
          data: data,
        });
        this.lineChartOption.legendData.data.push(name);
      }
    }
  }

  convertBarData(
    statistic: Array<GarbageStationNumberStatisticV2>,
    search: SearchControl
  ) {
    const s = search.toSearchParam();
    this.barChartOption = new BarOption();

    var xAxisData = new Array();

    if (s.TimeUnit == TimeUnitEnum.Month) {
      const lastDay = MonthLastDay(parseInt(s.Year), parseInt(s.Month));

      for (let i = 1; i <= lastDay; i++) {
        if (i < 10) xAxisData.push(`0${i}日`);
        else xAxisData.push(`${i}日`);
      }
      this.barChartOption.barWidth = 10;
    } else if (s.TimeUnit == TimeUnitEnum.Week) {
      xAxisData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      this.barChartOption.barWidth = 20;
    }
    this.barChartOption.xAxisData = xAxisData;
    this.barChartOption.seriesData = new Array();
    this.barChartOption.subTitle = "";

    this.barChartOption.legendData.color = "#cfd7ff";
    this.barChartOption.legendData.fontSize = 16;
    this.barChartOption.legendData.itemHeight = 10;
    this.barChartOption.legendData.itemWidth = 10;
    this.barChartOption.legendData.right = 50;
    this.barChartOption.legendData.orient = "vertical";
    this.barChartOption.axisLabel.formatter = (v: any) => {
      if (
        s.ClassType == CategoryNameEnum.IllegalDrop ||
        s.ClassType == CategoryNameEnum.MixedInto
      )
        return v + "起";
      else if (s.ClassType == CategoryNameEnum.GarbageRatio) return v + "分";
      else return v + "分钟";
    };
    this.barChartOption.axisTick.show = true;
    this.barChartOption.axisLine.show = true;
    this.barChartOption.axisLabel.show = true;
    this.barChartOption.label.show = false;
    if (statistic) {
      const groupData = this.statisticGroupBy(statistic),
        findIllegalDrop = (e: Array<EventNumber>, type: EventType) => {
          return e.find((f) => f.EventType == type);
        };

      for (const key of groupData.keys()) {
        var gd = groupData.get(key),
          name = "",
          id = "";
        const data = new Array<string>();
        gd.map((g) => {
          if (id == "") {
            name = g.Name;
            id = g.Id;
          }
          switch (s.ClassType) {
            case CategoryNameEnum.GarbageRatio:
              data.push(IntegerDecimalNum(g.GarbageRatio + ""));
              break;
            case CategoryNameEnum.AvgGarbageTime:
              data.push(IntegerDecimalNum(g.AvgGarbageTime + ""));
              break;
            case CategoryNameEnum.MaxGarbageTime:
              data.push(IntegerDecimalNum(g.MaxGarbageTime + ""));
              break;
            case CategoryNameEnum.GarbageDuration:
              data.push(IntegerDecimalNum(g.GarbageDuration + ""));
              break;
            case CategoryNameEnum.IllegalDrop:
              data.push(
                findIllegalDrop(g.EventNumbers, EventType.IllegalDrop)
                  .DayNumber + ""
              );
              break;
            case CategoryNameEnum.MixedInto:
              data.push(
                findIllegalDrop(g.EventNumbers, EventType.MixedInto).DayNumber +
                  ""
              );
              break;

            default:
              break;
          }
        });
        this.barChartOption.seriesName.push(name);
        this.barChartOption.seriesData.push(data);
        this.barChartOption.legendData.data.push(name);
      }
    }
  }

  getRequsetParam(
    search: SearchControl
  ): GetGarbageStationStatisticNumbersParamsV2 {
    const s = search.toSearchParam();

    const param = new GetGarbageStationStatisticNumbersParamsV2(),
      sp = search.toSearchParam();
    param.GarbageStationIds = sp.StationId.split(",");

    if (s.TimeUnit == TimeUnitEnum.Week) {
      const week = OneWeekDate(
        new Date(
          Number.parseInt(s.Year),
          Number.parseInt(s.Month) - 1,
          Number.parseInt(s.Day)
        )
      );
      param.TimeUnit = 2;
      param.BeginTime = week.monday.toISOString();
      param.EndTime = week.sunday.toISOString();
    } else if (s.TimeUnit == TimeUnitEnum.Month) {
      const date = new Date(
          Number.parseInt(s.Year),
          Number.parseInt(s.Month) - 1,
          1,
          0,
          0,
          0,
          0
        ),
        lastDay = MonthLastDay(
          Number.parseInt(s.Year),
          Number.parseInt(s.Month)
        ),
        // , beginTime = TheDayTime(date)
        endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          lastDay,
          23,
          59,
          59
        );
      param.TimeUnit = 2;
      param.BeginTime = date.toISOString();
      param.EndTime = endTime.toISOString();
    }

    return param;
  }

  changeDatePicker() {
    const param = this.search.toSearchParam();

    if (param.TimeUnit == TimeUnitEnum.Month) {
      this.datePicker.minView = 3;
      this.datePicker.startView = 3;
      this.datePicker.formate = "yyyy年mm月";
      this.reportType = "月报表";
      return {
        time: `${param.Year}年${param.Month}月`,
        week: false,
      };
    } else if (param.TimeUnit == TimeUnitEnum.Week) {
      this.datePicker.minView = 2;
      this.datePicker.startView = 2;
      this.datePicker.formate = "yyyy年mm月dd日";
      this.reportType = "周报表";
      return {
        time: `${param.Year}年${param.Month}月${param.Day}日`,
        week: true,
      };
    }
  }

  exportExcel(
    statistic: Array<GarbageStationNumberStatisticV2>,
    search: SearchControl
  ): {
    table: XlsxData;
    chart: ExcelData;
    categoryName: string;
    dataUnit: string;
  } {
    const s = search.toSearchParam(),
      table = new XlsxData(),
      chart = new ExcelData(),
      groupData = this.statisticGroupBy(statistic),
      findIllegalDrop = (e: Array<EventNumber>, type: EventType) => {
        return e.find((f) => f.EventType == type);
      };
    // var dataLen = 0;
    chart.chartTitle = "";
    chart.fields = new Array();
    chart.dataKey = new Array();
    chart.titles = [];
    chart.data = new Object();
    table.fieldName = ["序号", "日期", "时间"];
    const map = new Map<
      string,
      { no: number; date: string; name: string; val: number }[]
    >();
    table.data = map;
    var dataUnit = "";
    for (const key of groupData.keys()) {
      var timeKey = new Array<{
        no: number;
        date: string;
        name: string;
        val: number;
      }>();

      if (s.TimeUnit == TimeUnitEnum.Month) {
        const date = new Date(parseInt(s.Year), parseInt(s.Month), 1),
          lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
        //monthMaxDay = lastDay;
        chart.dataLen = lastDay + 2;
        for (let i = 1; i <= lastDay; i++) {
          if (i < 10)
            timeKey.push({ no: i, date: "", name: `0${i}日`, val: 0 });
          else timeKey.push({ no: i, date: "", name: `${i}日`, val: 0 });
        }
      } else if (s.TimeUnit == TimeUnitEnum.Week) {
        let weekDays = OneWeekDay(
          new Date(
            Number.parseInt(s.Year),
            Number.parseInt(s.Month) - 1,
            Number.parseInt(s.Day)
          )
        );

        ["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map(
          (x, index) => {
            timeKey.push({
              no: index + 1,
              date: weekDays[index],
              name: x,
              val: 0,
            });
          }
        );
      }
      map.set(key, timeKey);
    }

    for (const key of groupData.keys()) {
      const td = table.data.get(key);
      var i = 0;

      for (const val of groupData.get(key).values()) {
        if (i == 0) table.fieldName.push(val.Name);
        switch (s.ClassType) {
          case CategoryNameEnum.GarbageRatio:
            td[i].val = parseFloat(IntegerDecimalNum(val.GarbageRatio + ""));
            dataUnit = "分";
            break;
          case CategoryNameEnum.AvgGarbageTime:
            td[i].val = parseFloat(IntegerDecimalNum(val.AvgGarbageTime + ""));
            dataUnit = "分钟";
            break;
          case CategoryNameEnum.MaxGarbageTime:
            td[i].val = parseFloat(IntegerDecimalNum(val.MaxGarbageTime + ""));
            dataUnit = "分钟";
            break;
          case CategoryNameEnum.GarbageDuration:
            td[i].val = parseFloat(IntegerDecimalNum(val.GarbageDuration + ""));
            dataUnit = "分钟";
          case CategoryNameEnum.IllegalDrop:
            td[i].val = findIllegalDrop(
              val.EventNumbers,
              EventType.IllegalDrop
            ).DayNumber;
            dataUnit = "起";
            break;
          case CategoryNameEnum.MixedInto:
            td[i].val = findIllegalDrop(
              val.EventNumbers,
              EventType.MixedInto
            ).DayNumber;
            dataUnit = "起";
            break;
          default:
            break;
        }
        i += 1;
      }
      chart.dataKey.push(key);
      chart.data[key] = new Object();
      table.data.set(key, td);
    }
    chart.fields = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

    return {
      table: table,
      chart: chart,
      categoryName: CategoryNameTextEnum[s.ClassType],
      dataUnit: dataUnit,
    };
  }
}

export class XlsxData {
  title: string;
  fieldName: string[];
  data: Map<string, { no: number; date: string; name: string; val: number }[]>;
}
