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
import { LineOption, BarOption, Bar3dOption } from "../../../../../common/directive/echarts/echart";
import "../../../../../common/string/hw-string";
import { XlsxData } from "../../illegal-drop-event-analyze/business/business.service";
import { ExcelData } from "../../../../../common/tool/hw-excel-js/data";
import { BusinessEventTypeEnum, convertEventData } from "../../business-event-type";
import { forkJoin } from "rxjs";
import { PagedList } from "../../../../../data-core/model/page";
import { Response } from "../../../../../data-core/model/Response";
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
    bar3dOption: Bar3dOption;
    barChartView = true;
    lineChartView = false;
    _3dBarChartView = false;
    _3dBarOption = false;
    datePicker = {
        startView: 2,
        minView: 2,
        formate: 'yyyy-mm-dd'
    }
    reportType = '';
    dataSources: Map<string, EventNumberStatistic[]>;
    divisionName = '';
    stationName = '';
    businessEventType = BusinessEventTypeEnum.IllegalDrop;
    constructor(private divisionService: DivisionRequestService
        , private datePipe: DatePipe
        , private garbageStationService: GarbageStationRequestService) {
        super();
        this.divisionDao = new DivisionDao(divisionService);
        this.garbageStationDao = new GarbageStationDao(garbageStationService);
    }

    initDivisionListView() {
        this.divisionListView = new DivisionListView();
        this.divisionListView.toLevelListPanel(this.divisions.filter(f => f.ParentId != null));
    }

    async requestData() {
        const s = this.search.toSearchParam()
            , requsetParam = this.getRequsetParam(this.search)
            , _3dRequsetParam = this.get3dRequsetParam(this.search)
            , mapData = new Map<string, EventNumberStatistic[]>();
        this.dataSources = mapData; 
        
        if (s.StationId) {
            const response = await this.garbageStationService.eventNumbersHistory(requsetParam.searchParam, requsetParam.stationId).toPromise();
            mapData.set(s.StationId, response.Data.Data);
            this.convertLineData(response.Data.Data, this.search);
            this.convertBarData(response.Data.Data, this.search);
            if(_3dRequsetParam){
                const  statistic= new Array<EventNumberStatistic>(),o = new Array();               
                (_3dRequsetParam.searchParam as any[]).map(async p=>{
                     o.push(this.garbageStationService.eventNumbersHistory(p, _3dRequsetParam.stationId));
                });
                forkJoin(o).subscribe(rs=>{
                   (rs as Array<Response<PagedList<EventNumberStatistic>>>).map(p=>{
                         p.Data.Data.map(m=>statistic.push(m));
                    });
                    this.convertBar3dData(statistic, this.search);
                });   
            }
         
        }
        else if (s.DivisionId) {
            const response = await this.divisionService.eventNumbersHistory(requsetParam.searchParam, requsetParam.divisionsId).toPromise();
            mapData.set(s.DivisionId, response.Data.Data);  
            this.convertLineData(response.Data.Data, this.search);
            this.convertBarData(response.Data.Data, this.search); 
            if(_3dRequsetParam){            
                const  statistic= new Array<EventNumberStatistic>(),o = new Array();               
                (_3dRequsetParam.searchParam as any[]).map(async p=>{
                     o.push(this.divisionService.eventNumbersHistory(p, _3dRequsetParam.divisionsId));
                });
                forkJoin(o).subscribe(rs=>{
                   (rs as Array<Response<PagedList<EventNumberStatistic>>>).map(p=>{
                         p.Data.Data.map(m=>statistic.push(m));
                    });
                    this.convertBar3dData(statistic, this.search);
                });               
            }
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
                chart.dataLen = 26;
            }
            else if (s.TimeUnit == TimeUnitEnum.Day) {
                const date = new Date(s.BeginTime)
                    , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
                monthMaxDay = lastDay;
                for (let i = 1; i <= lastDay; i++) {
                    if (i < 10) timeKey.push({ no: i, date: '', name: `0${i}日`, val: 0 });
                    else timeKey.push({ no: i, date: '', name: `${i}日`, val: 0 });
                }
                chart.dataLen = (lastDay + 2);
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
                    convertEventData(this.businessEventType, statistic[i].EventNumbers)
                        .map(ed => this.lineChartOption.seriesData.push(ed));
                }
                else this.lineChartOption.seriesData.push(0);
            }
        }
        else
            for (const x of statistic) {
                convertEventData(this.businessEventType, x.EventNumbers, s.TimeUnit == TimeUnitEnum.Hour)
                    .map(ed => this.lineChartOption.seriesData.push(ed));
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
                    convertEventData(this.businessEventType, statistic[i].EventNumbers)
                        .map(ed => seriesData.push(ed));
                }
                else seriesData.push(0);
            }
        }
        else
            for (const x of statistic) {
                convertEventData(this.businessEventType, x.EventNumbers, s.TimeUnit == TimeUnitEnum.Hour)
                    .map(ed => seriesData.push(ed));
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
            week.sunday.setHours(week.sunday.getHours() + 24);
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

    get3dRequsetParam(search: SearchControl) {

        const param = new GetDivisionEventNumbersParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const s = search.toSearchParam();
        s.BeginTime = s.BeginTime.dateTimePickerZC();
        const getParamArr = (date:Date)=>{
            const paramArr = new Array<GetDivisionEventNumbersParams>()
            ,createPamam = (week:{ monday: Date,sunday: Date})=>{
                var param = new GetDivisionEventNumbersParams();
                param.TimeUnit = 1;
                param.PageIndex=1;
                param.PageSize=this.maxSize;
                param.BeginTime = week.monday.toISOString();
                param.EndTime = week.sunday.toISOString();
                paramArr.push(param);
            };
            const  week1 = OneWeekDate(date);
            week1.sunday.setHours(week1.sunday.getHours() + 24);
            createPamam(week1);

            const week2 = OneWeekDate(week1.sunday);
            week2.sunday.setHours(week2.sunday.getHours() + 24);
            createPamam(week2);

            const week3 = OneWeekDate(week2.sunday);
            week3.sunday.setHours(week3.sunday.getHours() + 24);
            createPamam(week3);

            const week4 = OneWeekDate(week3.sunday);
            week4.sunday.setHours(week4.sunday.getHours() + 24);
            createPamam(week4);

            const week5 = OneWeekDate(week4.sunday);
            week5.sunday.setHours(week5.sunday.getHours() + 24);
            createPamam(week5);
            return paramArr;
        }
        if (s.TimeUnit == TimeUnitEnum.Day && s.ChartType == ChartTypeEnum._3dBar) {
            const date = new Date(Number.parseInt(s.Year)
                , Number.parseInt(s.Month) - 1)
                , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1)
                , beginTime = TheDayTime(date)
                , endTime = new Date(date.getFullYear(), date.getMonth(), lastDay, 24, 0, 0);
            param.TimeUnit = 1;
            param.BeginTime = beginTime.begin.toISOString();
            param.EndTime = endTime.toISOString();
            getParamArr(date);
            
            return {
                searchParam:  getParamArr(date),
                divisionsId: s.DivisionId,
                stationId: s.StationId
            };
        }
        else if (s.TimeUnit == TimeUnitEnum.Week && s.ChartType == ChartTypeEnum._3dBar) { 
            const week = OneWeekDate(new Date(Number.parseInt(s.Year)
                , Number.parseInt(s.Month) - 1, Number.parseInt(s.Day)));
            week.sunday.setHours(week.sunday.getHours() + 24);
            param.TimeUnit = 1;
            param.BeginTime = week.monday.toISOString();
            param.EndTime = week.sunday.toISOString();
            return {
                searchParam: [param],
                divisionsId: s.DivisionId,
                stationId: s.StationId
            };
        }

       
    }

    convertBar3dData(statistic: EventNumberStatistic[], search: SearchControl) {
        const s = search.toSearchParam(), seriesData = new Array()
            , weekNumberMap = new Map<string, Array<Array<number|string>>>();
         
        if (statistic.length == 0)
            return;
        if (s.TimeUnit == TimeUnitEnum.Week && s.ChartType ==ChartTypeEnum._3dBar) { 
            this.bar3dOption = new Bar3dOption();
            this.bar3dOption.boxDepth = 80; 
            this.bar3dOption.boxWidth = 200; 
            this.bar3dOption.beta=-40;
            this.bar3dOption.distance=300;
            this.bar3dOption.yAxis3dData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
            this.bar3dOption.xAxis3dData = new Array();
            for (let i = 0; i < 24; i++)
                this.bar3dOption.xAxis3dData.push(`${i}:00`);
       
            const week = OneWeekDate(new Date(Number.parseInt(s.Year)
                , Number.parseInt(s.Month) - 1, Number.parseInt(s.Day)))
            for (let i = 0; i < 7; i++) {
                const date = week.monday.getMonth() + '-' + week.monday.getDate()
                weekNumberMap.set(date, new Array());
                const arr = weekNumberMap.get(date);
                for (let j = 0; j < 24; j++) {                 
                    const findVal = statistic.find(s => {
                        const bg = new Date(s.BeginTime);                    
                        //if(j==0)
                        // console.log( `${parseInt((bg.getMonth()+1)+'')}-${parseInt(bg.getDate()+'')} ${parseInt(bg.getHours()+'')}`
                        // ,`${parseInt((week.monday.getMonth()+1)+'')}-${parseInt(week.monday.getDate()+'')} ${j}`);
                        return `${parseInt((bg.getMonth()+1)+'')}-${parseInt(bg.getDate()+'')} ${parseInt(bg.getHours()+'')}`
                            == `${parseInt((week.monday.getMonth()+1)+'')}-${parseInt(week.monday.getDate()+'')} ${j}`;
                    });
                    if (findVal)                       
                        convertEventData(this.businessEventType, findVal.EventNumbers, true)
                        .map(ed => { 
                            arr.push([i, j,ed,`${this.bar3dOption.yAxis3dData[i]},${j}:00`]);
                            this.bar3dOption.maxNumber = ed > this.bar3dOption.maxNumber ? ed : this.bar3dOption.maxNumber;
                        });  
                    else arr.push([i, j, 0,`${this.bar3dOption.yAxis3dData[i]},${j}:00`]); 
                }

                week.monday.setDate(week.monday.getDate() + 1);
            }
        }
        
        else  if (s.TimeUnit == TimeUnitEnum.Day && s.ChartType ==ChartTypeEnum._3dBar) {  console.log(statistic);
        
            const date = new Date(Number.parseInt(s.Year)
            , Number.parseInt(s.Month) - 1)
            , lastDay = MonthLastDay(date.getFullYear(), date.getMonth() + 1);
            this.bar3dOption = new Bar3dOption();
            this.bar3dOption.boxDepth = 220; 
            this.bar3dOption.boxWidth = 300; 
            this.bar3dOption.beta=-40;
            this.bar3dOption.distance=400;
            this.bar3dOption.yAxis3dData = new Array();
            this.bar3dOption.xAxis3dData = new Array();
            for (let i = 0; i < 24; i++)
                this.bar3dOption.xAxis3dData.push(`${i}:00`);
        
            for (let i = 1; i <= lastDay; i++)  
                this.bar3dOption.yAxis3dData.push(`${i}日`);
  
            for (let i = 0; i <lastDay; i++) {
            
                weekNumberMap.set(`${s.Month}-${(i+1)}`, new Array());
                const arr = weekNumberMap.get(`${s.Month}-${(i+1)}`);
                for (let j = 0; j < 24; j++) {
                   
                    const findVal = statistic.find(sc => {
                        const bg = new Date(sc.BeginTime);
                        // if(j==0)
                        // console.log(`${parseInt((bg.getMonth()+1)+'')}-${parseInt(bg.getDate()+'')} ${parseInt(bg.getHours()+'')}`
                        // ,`${s.Month}-${i} ${j}`);
                        return `${parseInt((bg.getMonth()+1)+'')}-${parseInt(bg.getDate()+'')} ${parseInt(bg.getHours()+'')}`
                            == `${parseInt(s.Month)}-${(i+1)} ${j}`;
                    });
                    if (findVal) 
                        convertEventData(this.businessEventType, findVal.EventNumbers, true)
                            .map(ed => { 
                                arr.push([i, j,ed,`${(i+1)}日,${j}:00`]);
                                this.bar3dOption.maxNumber = ed > this.bar3dOption.maxNumber ? ed : this.bar3dOption.maxNumber;
                            }); 
                    else arr.push([i, j, 0,`${(i+1)}日,${j}:00`]); 
                } 
            }
        }
        else return;
           for (const v of weekNumberMap.values()) 
               v.map(m=>{
                   seriesData.push(m); 
               }); 
           this.bar3dOption.seriesData=seriesData;  
            
    }

   
    resetChartType(){
        this.search.chartType = ChartTypeEnum.Bar;
        this.changeChartType();
    }

    changeChartType() {
        const param = this.search.toSearchParam();
        if (param.ChartType == ChartTypeEnum.Bar) {
            this.barChartView = true;
            this.lineChartView = false;
            this._3dBarChartView=false;
        }
        else if (param.ChartType == ChartTypeEnum.Line) {
            this.barChartView = false;
            this.lineChartView = true;
            this._3dBarChartView=false; 
        }
        else if (param.ChartType == ChartTypeEnum._3dBar) {
            this.barChartView = false;
            this.lineChartView = false;
            this._3dBarChartView=true;
            this.bar3dOption=null;
            this.requestData();
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
            this.reportType = '日报表';
            this._3dBarOption=false; 
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
            this.reportType = '月报表';
            this._3dBarOption=true;
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
            this.reportType = '周报表'; 
            this._3dBarOption=true;
            return {
                time: `${param.Year}年${param.Month}月${param.Day}日`,
                time2: `${param.Year}-${param.Month}-${param.Day}`,
                week: true
            };
        } 
        this.bar3dOption=null;
    }


}