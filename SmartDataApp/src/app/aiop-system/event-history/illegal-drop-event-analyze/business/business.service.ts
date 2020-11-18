import { Injectable } from "@angular/core";
import { DivisionListView } from "../../../../shared-module/business-component/event-history/division-list-view";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { EventNumberStatistic, GetDivisionEventNumbersParams } from "../../../../data-core/model/waste-regulation/division-event-numbers";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import { SearchControl } from "./search";
import { DatePipe } from "@angular/common";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { TheDayTime, MonthLastDay, OneWeekDate } from "../../../../common/tool/tool.service";
import { ChartTypeEnum, TimeUnitEnum, ClassTypeEnum } from "./search";
import { LineOption, BarOption } from "../../../../common/directive/echarts/echart";
import { EventTypeEnum } from "../../../../common/tool/enum-helper";
import "../../../../common/string/hw-string";
@Injectable()
export class BusinessService extends ListAttribute {

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
    divisionNode = true;
    constructor(private divisionService: DivisionRequestService
        , private datePipe: DatePipe
        , private garbageStationService: GarbageStationRequestService) {
        super();

    }

    toDivisionIdsOrStationIds(ids: string[]) {
        const s = this.search.toSearchParam();
        if (s.ClassType == ClassTypeEnum.Division)
            this.search.divisionId = ids;
        else if (s.ClassType == ClassTypeEnum.Station)
            this.search.stationId = ids;
    }

    async requestData(param: Array<{ id: string, text: string }>) {
        const s = this.search.toSearchParam()
            , requsetParam = this.getRequsetParam(this.search);
        if (s.StationId) {
            const stationIds = s.StationId.split(',') , mapData = new Map<string, EventNumberStatistic[]>();;
            for (const x of stationIds) {
                const response = await this.garbageStationService.eventNumbersHistory(requsetParam.searchParam, x).toPromise();
                mapData.set(x, response.Data.Data);
            }
            this.convertLineData(mapData, this.search, param);
            this.convertBarData(mapData, this.search, param);
        }
        else if (s.DivisionId) {
            const divisionIds = s.DivisionId.split(',')
                , mapData = new Map<string, EventNumberStatistic[]>();
            for (const x of divisionIds) {
                const response = await this.divisionService.eventNumbersHistory(requsetParam.searchParam, x).toPromise();
                mapData.set(x, response.Data.Data);                
            }

            this.convertLineData(mapData, this.search, param);
            this.convertBarData(mapData, this.search, param);
        }
    }

    convertLineData(statistic: Map<string, EventNumberStatistic[]>, search: SearchControl, param: Array<{ id: string, text: string }>) {
        const s = search.toSearchParam();
        this.lineChartOption = new LineOption();
        this.lineChartOption.moreLine = true;
        this.lineChartOption.seriesLabel = null;
        this.lineChartOption.left = '0';
        this.lineChartOption.right = '0';
        this.lineChartOption.xAxisData = new Array();
    
        if (s.TimeUnit == TimeUnitEnum.Hour) {
            this.lineChartOption.xAxisInterval = [0, 4, 8, 12, 16, 20, 23];
            for (let i = 1; i <= 24; i++) {
                if (i < 10) this.lineChartOption.xAxisData.push(`0${i}:00`);
                else if (i == 24) this.lineChartOption.xAxisData.push(`23:59`);
                else this.lineChartOption.xAxisData.push(`${i}:00`);
            }
        }
        else if (s.TimeUnit == TimeUnitEnum.Day) {
            const date = new Date(s.BeginTime)
                , lastDay = MonthLastDay(date.getFullYear(), date.getMonth());
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
        this.lineChartOption.legendData.color='#cfd7ff';
        this.lineChartOption.legendData.fontSize=16;       
        this.lineChartOption.legendData.right=50;
        this.lineChartOption.legendData.orient='vertical';
        this.lineChartOption.seriesData = new Array<{ name: string, data: number[] }>(); 
        param.map((val) => {
            const data = statistic.get(val.id);
            const dayNum = new Array<number>();
            for (const x of data) {

                for (const e of x.EventNumbers)
                    if (e.EventType == EventTypeEnum.IllegalDrop)
                        dayNum.push(e.DayNumber);
            }
            this.lineChartOption.legendData.data.push(val.text);
            this.lineChartOption.seriesData.push({
                name: val.text,
                data: dayNum
            });
        });
 
    }

    convertBarData(statistic: Map<string, EventNumberStatistic[]>, search: SearchControl, param: Array<{ id: string, text: string }>) {
        const s = search.toSearchParam();
        this.barChartOption = new BarOption();

        var xAxisData = new Array();
        if (s.TimeUnit == TimeUnitEnum.Hour) {
            for (let i = 1; i <= 24; i++) {
                if (i < 10) xAxisData.push(`0${i}:00`);
                else if (i == 24) xAxisData.push(`23:59`);
                else xAxisData.push(`${i}:00`);
            }
            this.barChartOption.barWidth = 10;
        }
        else if (s.TimeUnit == TimeUnitEnum.Day) {
            const date = new Date(s.BeginTime)
                , lastDay = MonthLastDay(date.getFullYear(), date.getMonth());
            for (let i = 1; i <= lastDay; i++) {
                if (i < 10) xAxisData.push(`0${i}日`);
                else xAxisData.push(`${i}日`);
            }            
        this.barChartOption.barWidth = 10;
        }
        else if (s.TimeUnit == TimeUnitEnum.Week) {
            xAxisData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];            
        this.barChartOption.barWidth = 20;
        }
        this.barChartOption.xAxisData = xAxisData;
        this.barChartOption.seriesData = new Array();
        this.barChartOption.subTitle = '';
        const seriesData = new Array();
        this.barChartOption.legendData.color='#cfd7ff';
        this.barChartOption.legendData.fontSize=16;
        this.barChartOption.legendData.itemHeight=10;
        this.barChartOption.legendData.itemWidth=10;        
        this.barChartOption.legendData.right=50;
        this.barChartOption.legendData.orient='vertical';
        param.map((val) => {
            const data = statistic.get(val.id);
            const dayNum = new Array<number>();
            for (const x of data) {

                for (const e of x.EventNumbers)
                    if (e.EventType == EventTypeEnum.IllegalDrop)
                        dayNum.push(e.DayNumber);
            }
            this.barChartOption.legendData.data.push(val.text);
            this.barChartOption.seriesName.push(val.text);
            seriesData.push(dayNum);
        });
        this.barChartOption.seriesData = seriesData;
        //  console.log(this.barChartOption);

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

    changeClassType(fn: (param:boolean) => void) {
        const param = this.search.toSearchParam();
        if (param.ClassType == ClassTypeEnum.Division)
            this.divisionNode = true; 
        
        else if (param.ClassType == ClassTypeEnum.Station) 
            this.divisionNode = false;
        fn(this.divisionNode);        
    }

    changeDatePicker() {
        const param = this.search.toSearchParam();
        if (param.TimeUnit == TimeUnitEnum.Hour) {
            this.datePicker.minView = 2;
            this.datePicker.startView = 2;
            this.datePicker.formate = 'yyyy年mm月dd日';
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Day) {
            this.datePicker.minView = 3;
            this.datePicker.startView = 3;
            this.datePicker.formate = 'yyyy年mm月';
            return {
                time: `${param.Year}年${param.Month}月`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Week) {
            this.datePicker.minView = 2;
            this.datePicker.startView = 2;
            this.datePicker.formate = 'yyyy年mm月dd日';
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                week: true
            };
        }
    }


}