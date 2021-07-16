import { Injectable } from "@angular/core";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import {
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticNumbersParamsV2,
} from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { SearchControl, TimeUnitEnum } from "./search";
import { DatePipe } from "@angular/common";
import {
  TheBeforeDate,
  OneWeekDate,
  MonthLastDay,
  TheDayTime,
  TimeInterval,
} from "../../../../../common/tool/tool.service";
import { BarOptionV2 } from "../../../../../common/directive/echarts/echart";
import "../../../../../common/string/hw-string";
import { StatisticTable, StatisticRecord } from "./statistic-table";
import { DivisionListView } from "../../../event-history/division-list-view";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
@Injectable()
export class BusinessService extends ListAttribute {
  search = new SearchControl(this.datePipe);
  barChartOption: BarOptionV2;
  barItemW = 0;
  datePicker = {
    startView: 2,
    minView: 2,
    formate: "yyyy-mm-dd",
  };
  reportType = "";
  dataSource: Array<GarbageStationNumberStatisticV2>;
  divisions = new Array<Division>();
  garbageStations = new Array<GarbageStation>();
  statisticTable: StatisticTable;
  divisionListView: DivisionListView;
  constructor(
    private datePipe: DatePipe,
    private garbageStationService: GarbageStationRequestService
  ) {
    super();
    this.statisticTable = new StatisticTable();
  }

  async requestData() {
    const param = this.getRequsetParam(this.search);
    if (param.GarbageStationIds.length) {
      const statisticNumbers2 =
        await this.garbageStationService.statisticNumberListV2(param);
      //console.log(statisticNumbers2);
      this.dataSource = statisticNumbers2;
      const data = new StatisticRecord();
      data.items = statisticNumbers2;
      this.statisticTable.clearItems();
      this.statisticTable.Convert(data, this.statisticTable.dataSource);
      this.statisticTable.totalCount = 1;
    } else this.statisticTable.clearItems();
  }

  initDivisionListView() {
    this.divisionListView = new DivisionListView();
    this.divisionListView.toLevelListPanel(this.divisions);
  }

  getRequsetParam(
    search: SearchControl
  ): GetGarbageStationStatisticNumbersParamsV2 {
    const s = search.toSearchParam();

    const param = new GetGarbageStationStatisticNumbersParamsV2(),
      sp = search.toSearchParam();
    param.GarbageStationIds =
      sp.StationId && sp.StationId.length
        ? sp.StationId.split(",")
        : new Array();
    if (s.TimeUnit == TimeUnitEnum.Day) {
      const time = TimeInterval(
        new Date(
          Number.parseInt(s.Year),
          Number.parseInt(s.Month) - 1,
          Number.parseInt(s.Day)
        ).toISOString(),
        0,
        0,
        0,
        -1
      );
      param.TimeUnit = 2;
      param.BeginTime = time.start.toISOString();
      param.EndTime = time.end.toISOString();
    } else if (s.TimeUnit == TimeUnitEnum.Week) {
      const week = OneWeekDate(
          new Date(
            Number.parseInt(s.Year),
            Number.parseInt(s.Month) - 1,
            Number.parseInt(s.Day)
          )
        ),
        time = TheBeforeDate(week.monday, -7);
      param.TimeUnit = 3;
      param.BeginTime = time.begin.toISOString();
      param.EndTime = week.sunday.toISOString();
    } else if (s.TimeUnit == TimeUnitEnum.Month) {
      const time = TheBeforeDate(
          new Date(Number.parseInt(s.Year), Number.parseInt(s.Month) - 1, 1),
          0,
          -1
        ),
        lastDay = MonthLastDay(
          Number.parseInt(s.Year),
          Number.parseInt(s.Month)
        );
      param.TimeUnit = 4;
      param.BeginTime = time.begin.toISOString();
      param.EndTime = new Date(
        Number.parseInt(s.Year),
        Number.parseInt(s.Month) - 1,
        lastDay
      ).toISOString();
    }

    return param;
  }

  changeDatePicker() {
    const param = this.search.toSearchParam();
    if (param.TimeUnit == TimeUnitEnum.Day) {
      this.datePicker.minView = 2;
      this.datePicker.startView = 2;
      this.datePicker.formate = "yyyy年mm月dd日";
      this.reportType = "日报表";
      return {
        time: `${param.Year}年${param.Month}月${param.Day}日`,
        week: false,
      };
    } else if (param.TimeUnit == TimeUnitEnum.Month) {
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
