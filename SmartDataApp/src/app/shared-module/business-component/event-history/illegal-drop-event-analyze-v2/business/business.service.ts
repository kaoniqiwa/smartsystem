import { Injectable } from "@angular/core";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { GetDivisionStatisticNumbersParamsV2, DivisionNumberStatisticV2 } from "../../../../../data-core/model/waste-regulation/division-number-statistic";
import { GarbageStationNumberStatisticV2, GetGarbageStationStatisticNumbersParamsV2 } from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { SearchControl } from "./search";
import { DatePipe } from "@angular/common";
import { TheDayTime, MonthLastDay, OneWeekDate } from "../../../../../common/tool/tool.service";
import { TimeUnitEnum, ClassTypeEnum } from "../../illegal-drop-event-analyze/business/search";
import { BarOptionV2 } from "../../../../../common/directive/echarts/echart";
import { EventTypeEnum } from "../../../../../common/tool/enum-helper";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station"; 
import "../../../../../common/string/hw-string";
import { DivisionTypeEnum } from '../../../../../common/tool/enum-helper';

import { ExcelData } from "../../../../../common/tool/hw-excel-js/data";
declare const echarts: any;
@Injectable()
export class BusinessService extends ListAttribute {

    divisions: Array<Division>;
    garbageStations: Array<GarbageStation>;
    search = new SearchControl(this.datePipe);
    barChartOption: BarOptionV2;
    barItemW = 0;
    datePicker = {
        startView: 2,
        minView: 2,
        formate: 'yyyy-mm-dd'
    }
    reportType='';
    dataSources: Array<DivisionNumberStatisticV2> | Array<GarbageStationNumberStatisticV2>;
    constructor(private divisionService: DivisionRequestService
        , private datePipe: DatePipe
        , private garbageStationService: GarbageStationRequestService) {
        super();
        this.divisions = new Array<Division>();
        this.garbageStations = new Array<GarbageStation>();
    }

    toDivisionIdsOrStationIds() {
        const s = this.search.toSearchParam(), ids = new Array<string>();;
        if (s.ClassType == ClassTypeEnum.Division) {
            this.divisions.map(x => {
                if (x.DivisionType == DivisionTypeEnum.Committees) ids.push(x.Id);
            });
            this.search.divisionId = ids;
            this.search.stationId = new Array();
        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            this.garbageStations.map(x => ids.push(x.Id));
            this.search.stationId = ids;
            this.search.divisionId = new Array();
        }
    }

    async requestData() {
        const s = this.search.toSearchParam()
            , requsetParam = this.getRequsetParam(this.search);
        if (s.ClassType == ClassTypeEnum.Station) {
            const response = await this.garbageStationService.statisticNumberListV2(requsetParam as any).toPromise();
            this.dataSources = response.Data;
            this.convertBarData(response.Data, this.search);
        }
        else if (s.ClassType == ClassTypeEnum.Division) {
            const response = await this.divisionService.statisticNumberListV2(requsetParam as any).toPromise();
            this.dataSources = response.Data;
            this.convertBarData(response.Data, this.search);
        }
    }

    exportExcel1(statistic: Array<DivisionNumberStatisticV2> | Array<GarbageStationNumberStatisticV2>, search: SearchControl)
        : ExcelData {
        const s = search.toSearchParam(), excelData = new ExcelData();


        if (s.ClassType == ClassTypeEnum.Division) {
            const statistic_ = statistic as Array<DivisionNumberStatisticV2>;
            excelData.chartTitle = this.search.beginDate + '居委会总数据';
            excelData.fields = [];
            excelData.titles = [this.search.beginDate + '居委会总数据'];
            excelData.dataKey = ['illegal-drop'];
            excelData.fieldName = ['居委会', '乱扔垃圾(起)'];
            excelData.data = {
                'illegal-drop': {
                }
            };
            statistic_.map(c => {
                excelData.fields.push(c.Name);
                c.EventNumbers.map(d => {
                    if (d.EventType == EventTypeEnum.IllegalDrop)
                        excelData.data['illegal-drop'][c.Name] = d.DayNumber;
                });

            });
        }
        else if (s.ClassType == ClassTypeEnum.Station) {

            const statistic_ = statistic as Array<GarbageStationNumberStatisticV2>;
            excelData.chartTitle = this.search.beginDate + '投放点总数据';
            excelData.fields = [];
            excelData.titles = [this.search.beginDate + '投放点总数据'];
            excelData.dataKey = ['illegal-drop'];
            excelData.fieldName = ['投放点', '乱扔垃圾(起)'];
            excelData.data = {
                'illegal-drop': {
                }
            };
            statistic_.map(c => {
                excelData.fields.push(c.Name);
                c.EventNumbers.map(d => {
                    if (d.EventType == EventTypeEnum.IllegalDrop)
                        excelData.data['illegal-drop'][c.Name] = d.DayNumber;
                });

            });
        }
        return excelData;
    }

    exportExcel(statistic: Array<DivisionNumberStatisticV2> | Array<GarbageStationNumberStatisticV2>, search: SearchControl)
        : {
            table: XlsxData,
            chart: ExcelData
        } {
        const s = search.toSearchParam(), table = new XlsxData(), chart = new ExcelData()
        ,dataMap = new Map<string, number>(),
        statistic_ = statistic as Array<DivisionNumberStatisticV2>;
        chart.chartTitle = '';
        table.title = '';
        chart.fields = [];
        chart.titles = [];
        chart.dataKey = ['illegal-drop'];
        chart.chartCatStrRef = 'B'
        chart.data = {
            'illegal-drop': {
            }
        };    
     
     
        table.data = new Array<{ no: number, name: string, val: number }>();
        statistic_.map(m => {
            if (dataMap.has(m.Name)) {
                var val = dataMap.get(m.Name);
                m.EventNumbers.map(d => {
                    if (d.EventType == EventTypeEnum.IllegalDrop)
                        dataMap.set(m.Name, val+d.DayNumber);
                });
            }
            else m.EventNumbers.map(d => {
                if (d.EventType == EventTypeEnum.IllegalDrop)
                    dataMap.set(m.Name, d.DayNumber);
            });
        });
        var  i=1; 
        for(const d of dataMap.keys())
        {
            chart.fields.push(d);
            chart.data['illegal-drop'][d] = dataMap.get(d);
            table.data.push({
                no: i,
                name: d,
                val: dataMap.get(d)
            });
            i+=1;
        }   
        if (s.ClassType == ClassTypeEnum.Division) {
           
            table.fieldName = ['序号', '居委', '单位(起)'];
                     
        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            // const statistic_ = statistic as Array<GarbageStationNumberStatisticV2>;
            table.fieldName = ['序号', '投放点', '单位(起)'];
          
            
        }
        return {
            table: table,
            chart: chart
        };
    }


    convertBarData(statistic: Array<GarbageStationNumberStatisticV2> | Array<DivisionNumberStatisticV2>, search: SearchControl) {
        const s = search.toSearchParam(), yAxisData = new Array(), colors = ['#7d90bc', '#ff9100']
            , colors2 = ['rgb(125,144,188,0.5)', 'rgb(255,145,0,0.5)'];
       
        this.barChartOption = new BarOptionV2();
        this.barChartOption.yAxisData = yAxisData;
        this.barChartOption.seriesData = new Array();
        const seriesData = new Array();
        this.barChartOption.seriesName = [''];
        this.barChartOption.barWidth = 10;
        if (s.ClassType == ClassTypeEnum.Division) {
            var statistic_ = statistic as Array<DivisionNumberStatisticV2>, numArr = new Array<{
                value: number,
                itemStyle: {
                    color: any
                }
            }>();
            var i = 0;
            const dataMap = new Map<string, number>();
            statistic_ = statistic_.sort((a,b)=>{
                return a.EventNumbers[0].DayNumber - b.EventNumbers[0].DayNumber;
            });
            statistic_.map(m => {
                if (dataMap.has(m.Name)) {
                    var val = dataMap.get(m.Name);
                    m.EventNumbers.map(d => {
                        if (d.EventType == EventTypeEnum.IllegalDrop)
                            dataMap.set(m.Name, val+d.DayNumber);
                    });
                }
                else m.EventNumbers.map(d => {
                    if (d.EventType == EventTypeEnum.IllegalDrop)
                        dataMap.set(m.Name, d.DayNumber);
                });
            });
            this.barItemW = dataMap.size * 54;
            for(const c of dataMap.keys()){
                yAxisData.push(c);
                numArr.push({
                    value: dataMap.get(c),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0, color: colors2[i % 2]// 0% 处的颜色
                        }, {
                            offset: 1, color: colors[i % 2]  // 100% 处的颜色
                        }], false),
                    }
                });
                i += 1;
            }
          
            seriesData.push(numArr);
        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            var statistic_a = statistic as Array<GarbageStationNumberStatisticV2>, numArr = new Array<{
                value: number,
                itemStyle: {
                    color: any
                }
            }>();
            var i = 0;
            const dataMap = new Map<string, number>();
            statistic_a = statistic_a.sort((a,b)=>{
                return a.EventNumbers[0].DayNumber - b.EventNumbers[0].DayNumber;
            });
            statistic_a.map(m => {
                if (dataMap.has(m.Name)) {
                    var val = dataMap.get(m.Name);
                    m.EventNumbers.map(d => {
                        if (d.EventType == EventTypeEnum.IllegalDrop)
                            dataMap.set(m.Name, val+d.DayNumber);
                    });
                }
                else m.EventNumbers.map(d => {
                    if (d.EventType == EventTypeEnum.IllegalDrop)
                        dataMap.set(m.Name, d.DayNumber);
                });
            });
            this.barItemW = dataMap.size * 54;
            for(const c of dataMap.keys()){
                yAxisData.push(c);
                numArr.push({
                    value: dataMap.get(c),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0, color: colors2[i % 2]// 0% 处的颜色
                        }, {
                            offset: 1, color: colors[i % 2]  // 100% 处的颜色
                        }], false),
                    }
                });
                i += 1;
            };
          
            seriesData.push(numArr);
        }
        this.barChartOption.seriesData = seriesData;
        //  console.log(this.barChartOption);

    }

    getRequsetParam(search: SearchControl): GetDivisionStatisticNumbersParamsV2 | GetGarbageStationStatisticNumbersParamsV2 {
        const s = search.toSearchParam();

        if (s.ClassType == ClassTypeEnum.Division) {
            const param = new GetDivisionStatisticNumbersParamsV2();
            param.DivisionIds = s.DivisionId.split(',');
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
            return param;
        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            const param = new GetGarbageStationStatisticNumbersParamsV2();
            param.GarbageStationIds = s.StationId.split(',');
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
            return param;
        }
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
    data: { no: number, name: string, val: number }[];
}