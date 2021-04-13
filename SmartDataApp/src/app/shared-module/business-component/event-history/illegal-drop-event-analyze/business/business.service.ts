import { Injectable } from "@angular/core";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { EventRequestService as IllegalDropEventService } from "../../../../../data-core/repuest/Illegal-drop-event-record";
import { EventRequestService as MixedIntoEventService } from "../../../../../data-core/repuest/mixed-into-event-record";
import { EventNumberStatistic, GetDivisionEventNumbersParams } from "../../../../../data-core/model/waste-regulation/division-event-numbers";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { SearchControl } from "./search";
import { DatePipe } from "@angular/common";
import { TheDayTime, MonthLastDay, OneWeekDate } from "../../../../../common/tool/tool.service";
import { ChartTypeEnum, TimeUnitEnum, ClassTypeEnum } from "./search";
import { LineOption, BarOption,Bar3dOption } from "../../../../../common/directive/echarts/echart";
import "../../../../../common/string/hw-string";
import { ExcelData } from "../../../../../common/tool/hw-excel-js/data";
import { BusinessEventTypeEnum, convertEventData } from "../../business-event-type";
import { MixedIntoEventRecord } from "../../../../../data-core/model/waste-regulation/mixed-into-event-record";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { SessionUser } from "../../../../../common/tool/session-user";
import { DivisionTypeEnum } from "../../../../../common/tool/enum-helper";
@Injectable()
export class BusinessService extends ListAttribute {

    search = new SearchControl(this.datePipe);
    divisions:Array<Division>;
    lineChartOption: LineOption;
    barChartOption: BarOption;
    bar3dOption:Bar3dOption;
    barChartView = true;
    lineChartView = false;
    datePicker = {
        startView: 2,
        minView: 2,
        formate: 'yyyy-mm-dd'
    }
    divisionNode = false;
    oneDivisionNode = false;
    reportType = '';
    dataSources: Map<string, EventNumberStatistic[]>;
    businessEventType = BusinessEventTypeEnum.IllegalDrop;
    constructor(private divisionService: DivisionRequestService
        , private datePipe: DatePipe
        , private garbageStationService: GarbageStationRequestService
        , private illegalDropEventService: IllegalDropEventService
        , private mixedIntoEventService: MixedIntoEventService) {
        super();
        this.oneDivisionNode = this.cityOption;
        this.divisionNode = !this.cityOption;
    }

    toDivisionIdsOrStationIds(ids: string[]) {
        const s = this.search.toSearchParam();
        if (s.ClassType == ClassTypeEnum.Committees||s.ClassType == ClassTypeEnum.County) {
            this.search.divisionId = ids;
            this.search.stationId = new Array();
        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            this.search.stationId = ids;
            this.search.divisionId = new Array();
        }
    }

    get cityOption(){
        return new SessionUser().userDivisionType == (DivisionTypeEnum.City+'');
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
        const map = new Map<string, { no: number, date: string, name: string, val: number }[]>();
        table.data = map;
        param.map(x => {
            table.fieldName.push(x.text);
            var timeKey = new Array<{ no: number, date: string, name: string, val: number }>();
            if (s.TimeUnit == TimeUnitEnum.Hour) {

                for (let i = 0; i < 24; i++) {
                    if (i < 10) timeKey.push({ no: i + 1, date: '', name: `0${i}:00`, val: 0 });
                    else timeKey.push({ no: i + 1, date: '', name: `${i}:00`, val: 0 });
                }
            }
            else if (s.TimeUnit == TimeUnitEnum.Day) {
                const date = new Date(s.BeginTime)
                    , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
                monthMaxDay = lastDay;
                for (let i = 1; i <= lastDay; i++) {
                    if (i < 10) timeKey.push({ no: i, date: '', name: `0${i}日`, val: 0 });
                    else timeKey.push({ no: i, date: '', name: `${i}日`, val: 0 });
                }
                chart.dataLen = (lastDay+2);
            }
            else if (s.TimeUnit == TimeUnitEnum.Week) {
                ["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((x, index) => {
                    timeKey.push({ no: index + 1, date: '', name: x, val: 0 });
                });
            }
            map.set(x.id, timeKey);
        });

        var aCol = 0;
        param.map((val) => {

            const data = dataSources.get(val.id);
            const dayNum = new Array<number>(), dates = new Array<string>();

            chart.dataKey.push(val.id);
            chart.data[val.id] = new Object();


            if (s.TimeUnit == TimeUnitEnum.Day) {
                /**填补空缺 */
                var nullEvent = new Array<number>();
                for (let i = 0; i < monthMaxDay; i++) {
                    const findIndex = data.findIndex(x => {
                        if (x) {
                            const bt = new Date(x.BeginTime);
                            return bt.getDate() == (i + 1);
                        }

                    });
                    if (findIndex == -1) nullEvent.push(i);
                }
                nullEvent.map(x => data.splice(x, 0, null));

                for (let i = 0; i < monthMaxDay; i++) {
                    if (data[i]) {
                        convertEventData(this.businessEventType, data[i].EventNumbers)
                            .map(ed => dayNum.push(ed));
                        // for (const e of data[i].EventNumbers)
                        //     if (e.EventType == EventTypeEnum.IllegalDrop)
                        //         dayNum.push(e.DayNumber);
                    }
                    else dayNum.push(0);
                    dates.push(this.datePipe.transform(data[0].BeginTime, 'yyyy年MM月'));
                }
            }
            else
                for (const x of data) {
                    dates.push(this.datePipe.transform(x.BeginTime, 'yyyy年MM月dd日'));
                    convertEventData(this.businessEventType, x.EventNumbers, s.TimeUnit == TimeUnitEnum.Hour)
                        .map(ed => dayNum.push(ed));
                    // for (const e of x.EventNumbers)
                    //     if (e.EventType == EventTypeEnum.IllegalDrop)
                    //         if (s.TimeUnit == TimeUnitEnum.Hour)
                    //             dayNum.push(e.DeltaNumber);
                    //         else dayNum.push(e.DayNumber);
                }
            var i = 0, j = 0;
            for (const dv of map.get(val.id).values()) {
                dv.val = dayNum[i];
                dv.date = dates[i];
                if (aCol == 0) {
                    chart.fields.push(dv.name);
                }
                i += 1;
            }
            aCol += 1;

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

    async requestTodayEventData(onlyDivision: boolean,cityDivisionNode:boolean) {
        const requsetParam = this.getTodayEventRequsetParam(this.search)
            , groupEventData = new Map<string, Array<IllegalDropEventRecord | MixedIntoEventRecord>>()
            , fillGroupEventData = (event: IllegalDropEventRecord | MixedIntoEventRecord) => {console.log(event);
                if(cityDivisionNode&&onlyDivision==false){
                    const committees = this.divisions.find(d=>d.Id==event.Data.DivisionId)
                    ,division=this.divisions.find(d=>d.Id == committees.ParentId);
                    
                    if(groupEventData.has(division.Name)){console.log(division);
                        const e = groupEventData.get(division.Name);
                        e.push(event);
                        groupEventData.set(division.Name, e);
                    }
                    else{
                        groupEventData.set(division.Name, [event]);console.log(1);
                        
                    }
                }
                else{
                    if (onlyDivision && groupEventData.has(event.Data.DivisionName)) {
                        const e = groupEventData.get(event.Data.DivisionName);
                        e.push(event);
                        groupEventData.set(event.Data.DivisionName, e);
                    }
                    else if (onlyDivision && groupEventData.has(event.Data.DivisionName) == false)
                        groupEventData.set(event.Data.DivisionName, [event]);
    
                    if (onlyDivision == false && groupEventData.has(event.Data.StationName)) {
                        const e = groupEventData.get(event.Data.StationName);
                        e.push(event);
                        groupEventData.set(event.Data.StationName, e);
                    }
                    else if (onlyDivision == false && groupEventData.has(event.Data.StationName) == false)
                        groupEventData.set(event.Data.StationName, [event]);
                }
                
            };

        if (this.businessEventType == BusinessEventTypeEnum.IllegalDrop&&requsetParam) {
            const response = await this.illegalDropEventService.list(requsetParam).toPromise();
            if (response.Data && response.Data.Data)
                response.Data.Data.map(m => fillGroupEventData(m));
        }
        if (this.businessEventType == BusinessEventTypeEnum.MixedInfo&&requsetParam) {
            const response = await this.mixedIntoEventService.list(requsetParam).toPromise();
            if (response.Data && response.Data.Data)
                response.Data.Data.map(m => fillGroupEventData(m));
        }
        this.convertLineData(null, this.search,null, groupEventData);
        this.convertBarData(null, this.search,null, groupEventData);
    }

    async requestData(param: Array<{ id: string, text: string }>) {
        const s = this.search.toSearchParam()
            , requsetParam = this.getRequsetParam(this.search);
        if (s.StationId && requsetParam) {
            const stationIds = s.StationId.split(','), mapData = new Map<string, EventNumberStatistic[]>();;
            this.dataSources = mapData;
            for (const x of stationIds) {
                const response = await this.garbageStationService.eventNumbersHistory(requsetParam.searchParam, x).toPromise();
                mapData.set(x, response.Data.Data);
            }
            this.convertLineData(mapData, this.search, param);
            this.convertBarData(mapData, this.search, param); 
            this.convertBar3dData(mapData,this.search,param);
        }
        else if (s.DivisionId && requsetParam) {
            const divisionIds = s.DivisionId.split(',')
                , mapData = new Map<string, EventNumberStatistic[]>();
            this.dataSources = mapData;
            for (const x of divisionIds) {
                const response = await this.divisionService.eventNumbersHistory(requsetParam.searchParam, x).toPromise();
                mapData.set(x, response.Data.Data);
            }

            this.convertLineData(mapData, this.search, param);
            this.convertBarData(mapData, this.search, param);
            this.convertBar3dData(mapData,this.search,param);
        }
    }

    convertLineData(statistic: Map<string, EventNumberStatistic[]>, search: SearchControl, param: Array<{ id: string, text: string }>
        , mapEvents?: Map<string, Array<IllegalDropEventRecord | MixedIntoEventRecord>>) {
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
        if (mapEvents) {
            const everyHourNumber = (hour: number, e: Array<IllegalDropEventRecord | MixedIntoEventRecord>) => {
                var num = 0;
                e.map(m => {
                    const bt = new Date(m.EventTime);
                    num += bt.getHours() == hour ? 1 : 0;
                });
                return num;
            };
            for (const key of mapEvents.keys()) {
                const events = mapEvents.get(key), dayNum = new Array<number>();
                for (let i = 0; i < 24; i++)
                    dayNum.push(everyHourNumber(i, events));
                this.lineChartOption.legendData.data.push(key);
                this.lineChartOption.seriesData.push({
                    name: key,
                    data: dayNum
                });
            }
        }
        else
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

                    for (let i = 0; i < monthMaxDay; i++)
                        if (data[i])
                            convertEventData(this.businessEventType, data[i].EventNumbers)
                                .map(ed => dayNum.push(ed));
                        else dayNum.push(0);
                }
                else
                    for (const x of data)
                        convertEventData(this.businessEventType, x.EventNumbers, s.TimeUnit == TimeUnitEnum.Hour)
                            .map(ed => dayNum.push(ed));

                this.lineChartOption.legendData.data.push(val.text);
                this.lineChartOption.seriesData.push({
                    name: val.text,
                    data: dayNum
                });
            });

    }

    convertBarData(statistic: Map<string, EventNumberStatistic[]>, search: SearchControl, param: Array<{ id: string, text: string }>
        , mapEvents?: Map<string, Array<IllegalDropEventRecord | MixedIntoEventRecord>>) {
        const s = search.toSearchParam(); 
        if (s.TimeUnit == TimeUnitEnum.Week)return;
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
        this.bar3dOption=null;
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

        if (mapEvents) {
            const everyHourNumber = (hour: number, e: Array<IllegalDropEventRecord | MixedIntoEventRecord>) => {
                var num = 0;
                e.map(m => {
                    const bt = new Date(m.EventTime);
                    num += bt.getHours() == hour ? 1 : 0;
                });
                return num;
            };
            for (const key of mapEvents.keys()) {
                const events = mapEvents.get(key), dayNum = new Array<number>();
                for (let i = 0; i < 24; i++)
                    dayNum.push(everyHourNumber(i, events));
                this.barChartOption.legendData.data.push(key);
                this.barChartOption.seriesName.push(key);
                seriesData.push(dayNum);
            }
        }
        else
            param.map((val) => {
                const data = statistic.get(val.id);
                const dayNum = new Array<number>();
                if (s.TimeUnit == TimeUnitEnum.Day) {
                    for (let i = 0; i < monthMaxDay; i++) {
                        if (data[i])
                            convertEventData(this.businessEventType, data[i].EventNumbers)
                                .map(ed => dayNum.push(ed));

                        else dayNum.push(0);
                    }
                }
                else
                    for (const x of data)
                        convertEventData(this.businessEventType, x.EventNumbers, s.TimeUnit == TimeUnitEnum.Hour)
                        .map(ed => dayNum.push(ed));
                      

                this.barChartOption.legendData.data.push(val.text);
                this.barChartOption.seriesName.push(val.text);
                seriesData.push(dayNum);
            });
        this.barChartOption.seriesData = seriesData;

    }


    convertBar3dData(statistic: Map<string, EventNumberStatistic[]>, search: SearchControl, param: Array<{ id: string, text: string }>
         ) {
        const s = search.toSearchParam(), seriesData = new Array()
        , weekNumberMap = new Map<number,Array<Array<number>>>(); 
        if (s.TimeUnit == TimeUnitEnum.Week) { 
            this.barChartOption=null;
            this.bar3dOption = new Bar3dOption();
            this.bar3dOption.yAxis3dData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
            this.bar3dOption.xAxis3dData = new Array();
            param.map(m=>this.bar3dOption.xAxis3dData.push(m.text));
                 
            for (let i = 0; i < 7; i++)  {
                weekNumberMap.set(i,new Array());   
                for (let j = 0; j < param.length; j++){
                    const arr = weekNumberMap.get(i);
                    arr.push([i,j,0]);
                }
            } 
        } 
        else return;
        
        var xTag = 0;
        this.bar3dOption.maxNumber=1;
        param.map((val) => {
            const data = statistic.get(val.id);         
            
            for (let i = 0; i < data.length; i++) {
              
                convertEventData(this.businessEventType, data[i].EventNumbers, s.TimeUnit == TimeUnitEnum.Hour)
                .map(ed=>{
                    const wnm= weekNumberMap.get(i);
                    wnm[xTag][2] = ed;  
                    this.bar3dOption.maxNumber = ed > this.bar3dOption.maxNumber ? ed :this.bar3dOption.maxNumber;
                });
            } 
            xTag+=1;
            
        });  
      
        for (const v of weekNumberMap.values()) 
            v.map(m=>{
                seriesData.push(m); 
            }); 
        this.bar3dOption.seriesData=seriesData;
    }

    assertTodayDate(year: number, month: number, day: number) {
        const date = new Date(); console.log(date.getFullYear(), date.getMonth(), date.getDate());
        return date.getFullYear() == year && (date.getMonth() + 1) == month && date.getDate() == day;
    }

    getRequsetParam(search: SearchControl) {
        const param = new GetDivisionEventNumbersParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const s = search.toSearchParam();
        s.BeginTime = s.BeginTime.dateTimePickerZC();
        if (s.TimeUnit == TimeUnitEnum.Hour) {
            /**跳过当天 */
            if (this.assertTodayDate(parseInt(s.Year), parseInt(s.Month), parseInt(s.Day)))
                return null;
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

    getTodayEventRequsetParam(search: SearchControl) {
        const param = new GetEventRecordsParams()
            , s = search.toSearchParam()
            , time = TheDayTime(new Date(Number.parseInt(s.Year)
                , Number.parseInt(s.Month) - 1, Number.parseInt(s.Day)));
        /**只要当天 */
        if (this.assertTodayDate(parseInt(s.Year), parseInt(s.Month), parseInt(s.Day)) == false)
            return null;
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        param.BeginTime = time.begin.toISOString();
        param.EndTime = time.end.toISOString();
        if (s.DivisionId) param.DivisionIds = s.DivisionId.split(',');
        else if (s.StationId) param.StationIds = s.StationId.split(',');
        return param;
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

    changeClassType(fn: (ct:string) => void) {
        const param = this.search.toSearchParam();
        if (param.ClassType == ClassTypeEnum.Committees||param.ClassType == ClassTypeEnum.County)
            this.divisionNode = true;

        else if (param.ClassType == ClassTypeEnum.Station)
            this.divisionNode = false;
        fn(param.ClassType);
    }

    changeDatePicker() {
        const param = this.search.toSearchParam();
        if (param.TimeUnit == TimeUnitEnum.Hour) {
            this.datePicker.minView = 2;
            this.datePicker.startView = 2;
            this.datePicker.formate = 'yyyy年mm月dd日';
            this.reportType = '日报表';
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Day) {
            this.datePicker.minView = 3;
            this.datePicker.startView = 3;
            this.datePicker.formate = 'yyyy年mm月';
            this.reportType = '月报表';
            return {
                time: `${param.Year}年${param.Month}月`,
                week: false
            };
        }
        else if (param.TimeUnit == TimeUnitEnum.Week) {
            this.datePicker.minView = 2;
            this.datePicker.startView = 2;
            this.datePicker.formate = 'yyyy年mm月dd日';
            this.reportType = '周报表';
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
    data: Map<string, { no: number, date: string, name: string, val: number }[]>;
}