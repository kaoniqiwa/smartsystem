import { Injectable } from "@angular/core";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { EventNumberStatistic, GetDivisionEventNumbersParams } from "../../../../../data-core/model/waste-regulation/division-event-numbers";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { SearchControl } from "./search";
import { DatePipe } from "@angular/common";
import { TheDayTime, MonthLastDay, OneWeekDate } from "../../../../../common/tool/tool.service";
import { ChartTypeEnum, TimeUnitEnum, ClassTypeEnum } from "./search";
import { LineOption, BarOption } from "../../../../../common/directive/echarts/echart";
import { EventTypeEnum } from "../../../../../common/tool/enum-helper";
import "../../../../../common/string/hw-string";
import { ExcelData } from "../../../../../common/tool/hw-excel-js/data";
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
    reportType = '';
    dataSources: Map<string, EventNumberStatistic[]>;
    constructor(private divisionService: DivisionRequestService
        , private datePipe: DatePipe
        , private garbageStationService: GarbageStationRequestService) {
        super();

    }

    toDivisionIdsOrStationIds(ids: string[]) {
        const s = this.search.toSearchParam();
        if (s.ClassType == ClassTypeEnum.Division) {
            this.search.divisionId = ids;
            this.search.stationId = new Array();
        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            this.search.stationId = ids;
            this.search.divisionId = new Array();
        }
    }


    exportExcel(dataSources: Map<string, EventNumberStatistic[]>, search: SearchControl, param: Array<{ id: string, text: string }>)
        : {
            table: XlsxData,
            chart: ExcelData
        } {
        const s = search.toSearchParam(), table = new XlsxData(), chart = new ExcelData();
        var monthMaxDay = 0;
        chart.chartTitle = '';
        chart.fields = new Array();
        chart.dataKey = new Array();
        chart.titles = [];
        chart.data = new Object();  
        table.fieldName = ['序号', '日期', '时间']; 
        const map = new Map<string, {no:number,date:string,  name: string, val: number }[]>();                  
        table.data = map; 
        param.map(x=>{
            table.fieldName.push(x.text); 
            var timeKey = new Array<{ no:number,date:string, name: string, val: number }>();
            if (s.TimeUnit == TimeUnitEnum.Hour) {

                for (let i = 0; i < 24; i++) {
                    if (i < 10) timeKey.push({no:i+1,date:'', name: `0${i}:00`, val: 0 });
                    else timeKey.push({ no:i+1,date:'',name: `${i}:00`, val: 0 });
                }
            }
            else if (s.TimeUnit == TimeUnitEnum.Day) {
                const date = new Date(s.BeginTime)
                    , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
                monthMaxDay = lastDay;
                for (let i = 1; i <= lastDay; i++) {
                    if (i < 10) timeKey.push({no:i,date:'', name: `0${i}日`, val: 0 });
                    else timeKey.push({ no:i,date:'',name: `${i}日`, val: 0 });
                }
            }
            else if (s.TimeUnit == TimeUnitEnum.Week) {
                ["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((x,index) => {
                    timeKey.push({ no:index+1,date:'', name: x, val: 0 });
                });
            } 
            map.set(x.id,timeKey);
        });  
       
        var aCol=0;
        param.map((val) => {
            
            const data = dataSources.get(val.id);
            const dayNum = new Array<number>(),dates = new Array<string>();

            chart.dataKey.push(val.id);
            chart.data[val.id] = new Object();
          

            if (s.TimeUnit == TimeUnitEnum.Day) {
                /**填补空缺 */
                var nullEvent = new Array<number>();
                for (let i = 0; i < monthMaxDay; i++) {
                    const findIndex = data.findIndex(x => {
                        if(x){
                            const bt = new Date(x.BeginTime);
                            return bt.getDate() == (i + 1);
                        }
                      
                    });
                    if (findIndex == -1) nullEvent.push(i);
                }
                nullEvent.map(x => data.splice(x, 0, null));

                for (let i = 0; i < monthMaxDay; i++) {
                    if (data[i]) {
                        for (const e of data[i].EventNumbers)
                            if (e.EventType == EventTypeEnum.IllegalDrop)
                                dayNum.push(e.DayNumber);
                    }
                    else dayNum.push(0);
                    dates.push(this.datePipe.transform(data[0].BeginTime,'yyyy年MM月'));
                }
            }
            else
                for (const x of data) {                    
                    dates.push(this.datePipe.transform(x.BeginTime,'yyyy年MM月dd日'));
                    for (const e of x.EventNumbers)
                        if (e.EventType == EventTypeEnum.IllegalDrop)
                            if (s.TimeUnit == TimeUnitEnum.Hour)
                                dayNum.push(e.DeltaNumber);
                            else dayNum.push(e.DayNumber);

                }
              var  i=0,j = 0;
              for(const dv of map.get(val.id).values()){
                dv.val = dayNum[i];
                dv.date=dates[i];
                if(aCol==0) { 
                    chart.fields.push(dv.name); 
                }
                i+=1;
              } 
              aCol+=1;
           
            
            for (const k of table.data.keys()) {
                chart.data[val.id][k] = dayNum[j];
             
                j += 1;
            }
        });       

        return {
            table: table,
            chart: chart
        };
    }
    async requestData(param: Array<{ id: string, text: string }>) {
        const s = this.search.toSearchParam()
            , requsetParam = this.getRequsetParam(this.search);
        if (s.StationId) {
            const stationIds = s.StationId.split(','), mapData = new Map<string, EventNumberStatistic[]>();;
            this.dataSources = mapData;
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
            this.dataSources = mapData;
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
        this.lineChartOption.legendData.color = '#cfd7ff';
        this.lineChartOption.legendData.fontSize = 16;
        this.lineChartOption.legendData.right = 50;
        this.lineChartOption.legendData.orient = 'vertical';
        this.lineChartOption.seriesData = new Array<{ name: string, data: number[] }>();
        param.map((val) => {
            const data = statistic.get(val.id);
            const dayNum = new Array<number>();
            if (s.TimeUnit == TimeUnitEnum.Day) {
                /**填补空缺 */
                var nullEvent = new Array<number>();
                for (let i = 0; i < monthMaxDay; i++) {
                    const findIndex = data.findIndex(x => {
                        const bt = new Date(x.BeginTime);
                        return bt.getDate() == (i + 1);
                    });
                    if (findIndex == -1) nullEvent.push(i);
                }
                nullEvent.map(x => data.splice(x, 0, null));

                for (let i = 0; i < monthMaxDay; i++) {
                    if (data[i]) {
                        for (const e of data[i].EventNumbers)
                            if (e.EventType == EventTypeEnum.IllegalDrop)
                                dayNum.push(e.DayNumber);
                    }
                    else dayNum.push(0);
                }
            }
            else
                for (const x of data) {
                    for (const e of x.EventNumbers)
                        if (e.EventType == EventTypeEnum.IllegalDrop)
                            if (s.TimeUnit == TimeUnitEnum.Hour)
                                dayNum.push(e.DeltaNumber);
                            else dayNum.push(e.DayNumber);

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

        var xAxisData = new Array(), monthMaxDay = 0;
        if (s.TimeUnit == TimeUnitEnum.Hour) {
            for (let i = 0; i < 24; i++) {
                if (i < 10) xAxisData.push(`0${i}:00`);
                else xAxisData.push(`${i}:00`);
            }
            this.barChartOption.barWidth = 10;
        }
        else if (s.TimeUnit == TimeUnitEnum.Day) {
            const date = new Date(s.BeginTime)
                , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
            monthMaxDay = lastDay;
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
        this.barChartOption.legendData.color = '#cfd7ff';
        this.barChartOption.legendData.fontSize = 16;
        this.barChartOption.legendData.itemHeight = 10;
        this.barChartOption.legendData.itemWidth = 10;
        this.barChartOption.legendData.right = 50;
        this.barChartOption.legendData.orient = 'vertical';
        param.map((val) => {
            const data = statistic.get(val.id);
            const dayNum = new Array<number>();
            if (s.TimeUnit == TimeUnitEnum.Day) {

                for (let i = 0; i < monthMaxDay; i++) {
                    if (data[i]) {
                        for (const e of data[i].EventNumbers)
                            if (e.EventType == EventTypeEnum.IllegalDrop)
                                dayNum.push(e.DayNumber);
                    }
                    else dayNum.push(0);
                }
            }
            else
                for (const x of data) {
                    for (const e of x.EventNumbers)
                        if (e.EventType == EventTypeEnum.IllegalDrop)
                            if (s.TimeUnit == TimeUnitEnum.Hour)
                                dayNum.push(e.DeltaNumber);
                            else
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

    changeClassType(fn: (param: boolean) => void) {
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
            this.reportType='日报表';
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Day) {
            this.datePicker.minView = 3;
            this.datePicker.startView = 3;
            this.datePicker.formate = 'yyyy年mm月';
            this.reportType='月报表';
            return {
                time: `${param.Year}年${param.Month}月`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Week) {
            this.datePicker.minView = 2;
            this.datePicker.startView = 2;
            this.datePicker.formate = 'yyyy年mm月dd日';
            this.reportType='周报表';
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                week: true
            };
        }
    }


}

export class XlsxData {
    title: string;
    fieldName: string[]; 
    data: Map<string, { no:number,date:string,name: string, val: number }[]>;
}