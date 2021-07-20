import { Injectable } from "@angular/core";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import {
  GetDivisionStatisticNumbersParamsV2,
  DivisionNumberStatisticV2,
} from "../../../../../data-core/model/waste-regulation/division-number-statistic";
import {
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticNumbersParamsV2,
} from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { SearchControl } from "./search";
import { DatePipe } from "@angular/common";
import {
  TheDayTime,
  MonthLastDay,
  OneWeekDate,
} from "../../../../../common/tool/tool.service";
import {
  TimeUnitEnum,
  ClassTypeEnum,
} from "../../illegal-drop-event-analyze/business/search";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import "../../../../../common/string/hw-string";
import {
  BusinessEventTypeEnum,
  convertEventData,
} from "../../business-event-type";
import { ExcelData } from "../../../../../common/tool/hw-excel-js/data";
import { EventAnalyzeTable, EventsAnalyzeRecord } from "./event-analyze-table";
import { SessionUser } from "../../../../../common/tool/session-user";
import { DivisionType, EventType } from "../../../../../data-core/model/enum";
@Injectable()
export class BusinessService extends ListAttribute {
  divisions: Array<Division>;
  garbageStations: Array<GarbageStation>;
  search = new SearchControl(this.datePipe);
  datePicker = {
    startView: 2,
    minView: 2,
    formate: "yyyy-mm-dd",
  };
  reportType = "";
  dataSources:
    | Array<DivisionNumberStatisticV2>
    | Array<GarbageStationNumberStatisticV2>;
  businessEventType = BusinessEventTypeEnum.IllegalDrop;
  table: EventAnalyzeTable;
  constructor(
    private divisionService: DivisionRequestService,
    private datePipe: DatePipe,
    private garbageStationService: GarbageStationRequestService
  ) {
    super();
    this.divisions = new Array<Division>();
    this.garbageStations = new Array<GarbageStation>();
    this.table = new EventAnalyzeTable();
    this.table.findDivision = (id) => {
      const d = this.divisions.find((d) => d.Id == id);
      return this.divisions.find((f) => f.Id == d.ParentId);
    };
    this.table.findStationDivision = (id: string) => {
      const g = this.garbageStations.find((d) => d.Id == id);
      return this.divisions.find((f) => f.Id == g.DivisionId);
    };
  }

  get cityOption() {
    return new SessionUser().userDivisionType == DivisionType.City + "";
  }

  toDivisionIdsOrStationIds() {
    const s = this.search.toSearchParam(),
      ids = new Array<string>();
    if (s.ClassType == ClassTypeEnum.Committees) {
      this.divisions.map((x) => {
        if (x.DivisionType == DivisionType.Committees) ids.push(x.Id);
      });
      this.search.divisionId = ids;
      this.search.stationId = new Array();
    } else if (s.ClassType == ClassTypeEnum.County) {
      this.divisions.map((x) => {
        if (x.DivisionType == DivisionType.County) ids.push(x.Id);
      });
      this.search.divisionId = ids;
      this.search.stationId = new Array();
    } else if (s.ClassType == ClassTypeEnum.Station) {
      this.garbageStations.map((x) => ids.push(x.Id));
      this.search.stationId = ids;
      this.search.divisionId = new Array();
    }
  }

  async requestData() {
    const s = this.search.toSearchParam(),
      requsetParam = this.getRequsetParam(this.search);

    if (s.ClassType == ClassTypeEnum.Station) {
      this.table.classType = s.ClassType;
      const response = await this.garbageStationService.statisticNumberListV2(
        requsetParam as any
      );

      this.dataSources = response;
      this.convertTableData(response, this.search);
      const td = this.convertTableData(response, this.search);
      this.table.clearItems();
      this.table.Convert(td, this.table.dataSource);
    } else if (
      s.ClassType == ClassTypeEnum.Committees ||
      s.ClassType == ClassTypeEnum.County
    ) {
      this.table.classType = s.ClassType;
      const response = await this.divisionService.statisticNumberListV2(
        requsetParam as any
      );
      this.dataSources = response;
      const td = this.convertTableData(response, this.search);
      this.table.clearItems();
      this.table.Convert(td, this.table.dataSource);
    }
  }

  exportExcel(
    statistic:
      | Array<DivisionNumberStatisticV2>
      | Array<GarbageStationNumberStatisticV2>,
    search: SearchControl
  ): {
    table: XlsxData;
    chart: ExcelData;
  } {
    const s = search.toSearchParam(),
      table = new XlsxData(),
      chart = new ExcelData(),
      dataMap = new Map<string, number>(),
      statistic_ = statistic as Array<DivisionNumberStatisticV2>;
    chart.chartTitle = "";
    table.title = "";
    chart.fields = [];
    chart.titles = [];
    chart.dataKey = ["illegal-drop"];
    chart.chartCatStrRef = "B";
    chart.data = {
      "illegal-drop": {},
    };

    table.data = new Array<{ no: number; name: string; val: number }>();
    statistic_.map((m) => {
      const eventNumbers = convertEventData(
        this.businessEventType,
        m.EventNumbers
      );
      if (dataMap.has(m.Name)) {
        var val = dataMap.get(m.Name);
        // m.EventNumbers.map(d => {
        //     if (d.EventType == EventType.IllegalDrop)
        //         dataMap.set(m.Name, val + d.DayNumber);
        // });
        eventNumbers.map((d) => {
          dataMap.set(m.Name, val + d);
        });
      } else
        eventNumbers.map((d) => {
          dataMap.set(m.Name, d);
        });
      // m.EventNumbers.map(d => {
      //     if (d.EventType == EventType.IllegalDrop)
      //         dataMap.set(m.Name, d.DayNumber);

      // });
    });
    var i = 1;
    for (const d of dataMap.keys()) {
      chart.fields.push(d);
      chart.data["illegal-drop"][d] = dataMap.get(d);
      table.data.push({
        no: i,
        name: d,
        val: dataMap.get(d),
      });
      i += 1;
    }
    if (
      s.ClassType == ClassTypeEnum.Committees ||
      s.ClassType == ClassTypeEnum.County
    ) {
      table.fieldName = ["序号", "区划", "单位(起)"];
    } else if (s.ClassType == ClassTypeEnum.Station) {
      // const statistic_ = statistic as Array<GarbageStationNumberStatisticV2>;
      table.fieldName = ["序号", "投放点", "单位(起)"];
    }
    return {
      table: table,
      chart: chart,
    };
  }

  convertTableData(
    statistic:
      | Array<GarbageStationNumberStatisticV2>
      | Array<DivisionNumberStatisticV2>,
    search: SearchControl
  ) {
    const s = search.toSearchParam(),
      dataMap = new Map<string, { name: string; num: number }>(),
      ear = new EventsAnalyzeRecord();
    if (
      s.ClassType == ClassTypeEnum.Committees ||
      s.ClassType == ClassTypeEnum.County
    ) {
      var statistic_ = statistic as Array<DivisionNumberStatisticV2>;

      statistic_ = statistic_.sort((a, b) => {
        /**缺少 混合投放补全 */
        if (a.EventNumbers.length == 1)
          a.EventNumbers.push({
            DayNumber: 0,
            DeltaNumber: 0,
            EventType: EventType.MixedInto,
          });
        if (b.EventNumbers.length == 1)
          b.EventNumbers.push({
            DayNumber: 0,
            DeltaNumber: 0,
            EventType: EventType.MixedInto,
          });
        if (this.businessEventType == BusinessEventTypeEnum.IllegalDrop)
          return b.EventNumbers[0].DayNumber - a.EventNumbers[0].DayNumber;
        else if (this.businessEventType == BusinessEventTypeEnum.MixedInfo)
          return b.EventNumbers[1].DayNumber - a.EventNumbers[1].DayNumber;
      });

      statistic_.map((m) => {
        const eventNumbers = convertEventData(
          this.businessEventType,
          m.EventNumbers
        );
        if (dataMap.has(m.Id)) {
          const item = dataMap.get(m.Id);
          eventNumbers.map((d) => {
            item.num += d;
            dataMap.set(m.Id, item);
          });
        } else
          eventNumbers.map((d) => {
            dataMap.set(m.Id, {
              name: m.Name,
              num: d,
            });
          });
      });
    } else if (s.ClassType == ClassTypeEnum.Station) {
      var statistic_a = statistic as Array<GarbageStationNumberStatisticV2>;

      statistic_a = statistic_a.sort((a, b) => {
        if (this.businessEventType == BusinessEventTypeEnum.IllegalDrop)
          return b.EventNumbers[0].DayNumber - a.EventNumbers[0].DayNumber;
        else if (this.businessEventType == BusinessEventTypeEnum.MixedInfo)
          return b.EventNumbers[1].DayNumber - a.EventNumbers[1].DayNumber;
      });
      statistic_a.map((m) => {
        const eventNumbers = convertEventData(
          this.businessEventType,
          m.EventNumbers
        );
        if (dataMap.has(m.Id)) {
          const item = dataMap.get(m.Id);

          eventNumbers.map((d) => {
            item.num += d;
            dataMap.set(m.Id, item);
          });
        } else
          eventNumbers.map((d) => {
            dataMap.set(m.Id, {
              name: m.Name,
              num: d,
            });
          });
      });
    }
    ear.items = dataMap;
    return ear;
  }

  getRequsetParam(
    search: SearchControl
  ):
    | GetDivisionStatisticNumbersParamsV2
    | GetGarbageStationStatisticNumbersParamsV2 {
    const s = search.toSearchParam();

    if (
      s.ClassType == ClassTypeEnum.Committees ||
      s.ClassType == ClassTypeEnum.County
    ) {
      const param = new GetDivisionStatisticNumbersParamsV2();
      param.DivisionIds = s.DivisionId.split(",");
      s.BeginTime = s.BeginTime.dateTimePickerZC();
      if (s.TimeUnit == TimeUnitEnum.Hour) {
        const time = TheDayTime(
          new Date(
            Number.parseInt(s.Year),
            Number.parseInt(s.Month) - 1,
            Number.parseInt(s.Day)
          )
        );
        param.TimeUnit = 1;
        param.BeginTime = time.begin.toISOString();
        param.EndTime = time.end.toISOString();
      } else if (s.TimeUnit == TimeUnitEnum.Day) {
        const date = new Date(
            Number.parseInt(s.Year),
            Number.parseInt(s.Month) - 1
          ),
          lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1),
          beginTime = TheDayTime(date),
          endTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            lastDay,
            23,
            59,
            59
          );
        param.TimeUnit = 2;
        param.BeginTime = beginTime.begin.toISOString();
        param.EndTime = endTime.toISOString();
      } else if (s.TimeUnit == TimeUnitEnum.Week) {
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
      }
      return param;
    } else if (s.ClassType == ClassTypeEnum.Station) {
      const param = new GetGarbageStationStatisticNumbersParamsV2();
      param.GarbageStationIds = s.StationId.split(",");
      if (s.TimeUnit == TimeUnitEnum.Hour) {
        const time = TheDayTime(
          new Date(
            Number.parseInt(s.Year),
            Number.parseInt(s.Month) - 1,
            Number.parseInt(s.Day)
          )
        );
        param.TimeUnit = 1;
        param.BeginTime = time.begin.toISOString();
        param.EndTime = time.end.toISOString();
      } else if (s.TimeUnit == TimeUnitEnum.Day) {
        const date = new Date(
            Number.parseInt(s.Year),
            Number.parseInt(s.Month) - 1
          ),
          lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1),
          beginTime = TheDayTime(date),
          endTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            lastDay,
            23,
            59,
            59
          );
        param.TimeUnit = 2;
        param.BeginTime = beginTime.begin.toISOString();
        param.EndTime = endTime.toISOString();
      } else if (s.TimeUnit == TimeUnitEnum.Week) {
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
      }
      return param;
    }
  }

  changeDatePicker() {
    const param = this.search.toSearchParam();
    if (param.TimeUnit == TimeUnitEnum.Hour) {
      this.datePicker.minView = 2;
      this.datePicker.startView = 2;
      this.datePicker.formate = "yyyy年mm月dd日";
      this.reportType = "日报表";
      return {
        time: `${param.Year}年${param.Month}月${param.Day}日`,
        week: false,
      };
    } else if (param.TimeUnit == TimeUnitEnum.Day) {
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
}

export class XlsxData {
  title: string;
  fieldName: string[];
  data: { no: number; name: string; val: number }[];
}
