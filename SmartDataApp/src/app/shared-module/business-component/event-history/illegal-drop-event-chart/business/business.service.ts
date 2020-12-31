import { Injectable } from "@angular/core";
import { DivisionListView } from "../../division-list-view";
import { DivisionDao } from "../../../../../data-core/dao/division-dao";
import { GarbageStationDao } from "../../../../../data-core/dao/garbage-station-dao";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { EventNumberStatistic, GetDivisionEventNumbersParams } from "../../../../../data-core/model/waste-regulation/division-event-numbers";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { SearchControl } from "./search";
import { DatePipe } from "@angular/common";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { TheDayTime, MonthLastDay, OneWeekDate } from "../../../../../common/tool/tool.service";
import { ChartTypeEnum, TimeUnitEnum } from "./search";
import { LineOption, BarOption } from "../../../../../common/directive/echarts/echart";
import { EventTypeEnum } from "../../../../../common/tool/enum-helper";
import "../../../../../common/string/hw-string";
@Injectable()
export class BusinessService extends ListAttribute {
    divisionListView: DivisionListView;
    divisions = new Array<Division>();
    garbageStations = new Array<GarbageStation>();
    divisionDao: DivisionDao;
    garbageStationDao: GarbageStationDao;
    search = new SearchControl(this.datePipe);
    lineChartOption: LineOption;
    barChartOption: BarOption;
    barChartView = true;
    lineChartView = false;
    datePicker = {
        startView: 2,
        minView: 2,
        formate: 'yyyy-mm-dd'
    }
    constructor(private divisionService: DivisionRequestService
        , private datePipe: DatePipe
        , private garbageStationService: GarbageStationRequestService) {
        super();
        this.divisionDao = new DivisionDao(divisionService);
        this.garbageStationDao = new GarbageStationDao(garbageStationService);
    }

    initDivisionListView() {
        this.divisionListView = new DivisionListView();
        this.divisionListView.toLevelListPanel(this.divisions);
    }

    async requestData() {
        const s = this.search.toSearchParam()
            , requsetParam = this.getRequsetParam(this.search);
        if (s.StationId) {
            const response = await this.garbageStationService.eventNumbersHistory(requsetParam.searchParam, requsetParam.stationId).toPromise();

            this.convertLineData(response.Data.Data, this.search);
            this.convertBarData(response.Data.Data, this.search);
        }
        else if (s.DivisionId) {
            const response = await this.divisionService.eventNumbersHistory(requsetParam.searchParam, requsetParam.divisionsId).toPromise();
            this.convertLineData(response.Data.Data, this.search);
            this.convertBarData(response.Data.Data, this.search);
        }
    }

    convertLineData(statistic: EventNumberStatistic[], search: SearchControl) {
        const s = search.toSearchParam();
        this.lineChartOption = new LineOption();
        this.lineChartOption.seriesLabel = null;
        this.lineChartOption.left = '0';
        this.lineChartOption.right = '0';
        this.lineChartOption.xAxisData = new Array();
        var monthMaxDay = 0;
        if (s.TimeUnit == TimeUnitEnum.Hour) {
            this.lineChartOption.xAxisInterval = [0, 4, 8, 12, 16, 20, 23];
            for (let i = 0; i < 24; i++) {
                if (i < 10) this.lineChartOption.xAxisData.push(`0${i}:00`);             
                else this.lineChartOption.xAxisData.push(`${i}:00`);
            }
        }
        else if (s.TimeUnit == TimeUnitEnum.Day) {
            const date = new Date(s.BeginTime)
                , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
            monthMaxDay = lastDay;
            for (let i = 1; i <= lastDay; i++) {
                this.lineChartOption.xAxisInterval.push(i - 0);
                if (i < 10) this.lineChartOption.xAxisData.push(`0${i}日`);
                else this.lineChartOption.xAxisData.push(`${i}日`);
            }
        }
        else if (s.TimeUnit == TimeUnitEnum.Week) {
            this.lineChartOption.xAxisInterval = [0, 1, 2, 3, 4, 5, 6, 7];
            this.lineChartOption.xAxisData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        }

        this.lineChartOption.seriesData = new Array();
        if (s.TimeUnit == TimeUnitEnum.Day) {
            /**填补空缺 */
            var nullEvent = new Array<number>();
            for (let i = 0; i < monthMaxDay; i++) {
                const findIndex = statistic.findIndex(x => {
                    const bt = new Date(x.BeginTime);
                    return bt.getDate() == (i + 1);
                });
                if (findIndex == -1) nullEvent.push(i);
            }
            nullEvent.map(x => statistic.splice(x, 0, null));

            for (let i = 0; i < monthMaxDay; i++) {
                if (statistic[i]) {
                    for (const e of statistic[i].EventNumbers)
                        if (e.EventType == EventTypeEnum.IllegalDrop)
                            this.lineChartOption.seriesData.push(e.DayNumber);
                }
                else this.lineChartOption.seriesData.push(0);
            }
        }
        else
            for (const x of statistic) {
                for (const e of x.EventNumbers)
                    if (e.EventType == EventTypeEnum.IllegalDrop)
                        if (s.TimeUnit == TimeUnitEnum.Hour)
                            this.lineChartOption.seriesData.push(e.DeltaNumber);
                        else this.lineChartOption.seriesData.push(e.DayNumber);
            }
    }

    convertBarData(statistic: EventNumberStatistic[], search: SearchControl) {
        const s = search.toSearchParam();
        this.barChartOption = new BarOption();

        var xAxisData = new Array(), monthMaxDay = 0;
        if (s.TimeUnit == TimeUnitEnum.Hour) {
            for (let i = 0; i < 24; i++) {
                if (i < 10) xAxisData.push(`0${i}:00`);             
                else xAxisData.push(`${i}:00`);
            }

        }
        else if (s.TimeUnit == TimeUnitEnum.Day) {
            const date = new Date(s.BeginTime)
                , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
            monthMaxDay = lastDay;
            for (let i = 1; i <= lastDay; i++) {
                if (i < 10) xAxisData.push(`0${i}日`);
                else xAxisData.push(`${i}日`);
            }
        }
        else if (s.TimeUnit == TimeUnitEnum.Week) {
            xAxisData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        }
        this.barChartOption.xAxisData = xAxisData;
        this.barChartOption.seriesData = new Array();
        this.barChartOption.subTitle = '';
        this.barChartOption.barWidth = 30;
        const seriesData = new Array();
        if (s.TimeUnit == TimeUnitEnum.Day) {           

            for (let i = 0; i < monthMaxDay; i++) {
                if (statistic[i]) {                    
                    for (const e of statistic[i].EventNumbers)
                        if (e.EventType == EventTypeEnum.IllegalDrop)
                            seriesData.push(e.DayNumber);
                }
                else seriesData.push(0);
            }
        }
        else
            for (const x of statistic) { 
                for (const e of x.EventNumbers)
                    if (e.EventType == EventTypeEnum.IllegalDrop)
                        if (s.TimeUnit == TimeUnitEnum.Hour)
                            seriesData.push(e.DeltaNumber);
                        else
                            seriesData.push(e.DayNumber);
            }

        this.barChartOption.seriesData.push(seriesData);

    }

    getRequsetParam(search: SearchControl) {

        const param = new GetDivisionEventNumbersParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const s = search.toSearchParam();
        s.BeginTime = s.BeginTime.dateTimePickerZC();
        if (s.TimeUnit == TimeUnitEnum.Hour) {
            const time = TheDayTime(new Date(Number.parseInt(s.Year)
                , Number.parseInt(s.Month) - 1, Number.parseInt(s.Day)));
            param.TimeUnit = 1;
            param.BeginTime = time.begin.toISOString();
            param.EndTime = time.end.toISOString();
        }
        else if (s.TimeUnit == TimeUnitEnum.Day) {
            const date = new Date(Number.parseInt(s.Year)
                , Number.parseInt(s.Month) - 1)
                , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1)
                , beginTime = TheDayTime(date)
                , endTime = new Date(date.getFullYear(), date.getMonth(), lastDay, 23, 59, 59);
            param.TimeUnit = 2;
            param.BeginTime = beginTime.begin.toISOString();
            param.EndTime = endTime.toISOString();
        }
        else if (s.TimeUnit == TimeUnitEnum.Week) {
            // const time = TheDayTime(new Date(Number.parseInt(s.Year)
            // ,Number.parseInt(s.Month),Number.parseInt(s.Day)));
            const week = OneWeekDate(new Date(Number.parseInt(s.Year)
                , Number.parseInt(s.Month) - 1, Number.parseInt(s.Day)));
            param.TimeUnit = 2;
            param.BeginTime = week.monday.toISOString();
            param.EndTime = week.sunday.toISOString();
        }

        return {
            searchParam: param,
            divisionsId: s.DivisionId,
            stationId: s.StationId
        };
    }

    changeChartType() {
        const param = this.search.toSearchParam();
        if (param.ChartType == ChartTypeEnum.Bar) {
            this.barChartView = true;
            this.lineChartView = false;
        }
        else if (param.ChartType == ChartTypeEnum.Line) {
            this.barChartView = false;
            this.lineChartView = true;
        }
    }

    changeDatePicker() {
        const param = this.search.toSearchParam(), getDay = (month: string, day: string) => {
            const d = new Date();
            return (d.getMonth() + 1) + '' == month ? day : 1;
        };
        if (param.TimeUnit == TimeUnitEnum.Hour) {
            this.datePicker.minView = 2;
            this.datePicker.startView = 2;
            this.datePicker.formate = 'yyyy年mm月dd日';
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                time2: `${param.Year}-${param.Month}-${param.Day}`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Day) {
            this.datePicker.minView = 3;
            this.datePicker.startView = 3;
            this.datePicker.formate = 'yyyy年mm月';
            return {
                time: `${param.Year}年${param.Month}月`,
                time2: `${param.Year}-${param.Month}`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Week) {
            this.datePicker.minView = 2;
            this.datePicker.startView = 2;
            this.datePicker.formate = 'yyyy年mm月dd日';
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                time2: `${param.Year}-${param.Month}-${param.Day}`,
                week: true
            };
        }
    }


}