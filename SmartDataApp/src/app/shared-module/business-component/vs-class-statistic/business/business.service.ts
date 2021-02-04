import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { SearchControl } from "./search";
import { EventTypeEnum } from "../../../../common/tool/enum-helper";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { TheDayTime, MonthLastDay, Percentage } from "../../../../common/tool/tool.service";
import { TimeUnitEnum, ClassTypeEnum } from "./search";
import "../../../../common/string/hw-string";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import { DivisionNumberStatisticV2, GetDivisionStatisticNumbersParamsV2 } from "../../../../data-core/model/waste-regulation/division-number-statistic";
import { GarbageStationNumberStatisticV2, GetGarbageStationStatisticNumbersParamsV2 } from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";

@Injectable()
export class BusinessService extends ListAttribute {
    barChartOption: Array<BarOpt>;
    barChartOption2: Array<BarOpt>;
    datePicker = {
        startView: 2,
        minView: 2,
        formate: 'yyyy-mm-dd'
    }
    search = new SearchControl(this.datePipe);
    colors = ['#7d90bc', '#ff9100']; 
    constructor(private divisionService: DivisionRequestService
        , private datePipe: DatePipe
        , private garbageStationService: GarbageStationRequestService) {
        super();
        this.initBarOpt();
    }

    initBarOpt() {
        this.barChartOption = [new BarOpt('0', '1%', this.colors[0]), new BarOpt('0', '1%', this.colors[0])
            , new BarOpt('0', '1%', this.colors[0]), new BarOpt('0', '1%', this.colors[0]), new BarOpt('0', '1%', this.colors[0])];
        this.barChartOption2 = [new BarOpt('0', '1%', this.colors[0]), new BarOpt('0', '1%', this.colors[0])
            , new BarOpt('0', '1%', this.colors[0]), new BarOpt('0', '1%', this.colors[0]), new BarOpt('0', '1%', this.colors[0])];
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
    }

    async requestData() {
        const s = this.search.toSearchParam();
        if ((s.DivisionId1 && s.DivisionId2) || (s.StationId1 && s.StationId2)) {
            const requsetParam = this.getRequsetParam(this.search);
            if (s.ClassType == ClassTypeEnum.Station) {
                const response = await this.garbageStationService.statisticNumberListV2(requsetParam as any).toPromise();
                this.convertBarData(response.Data, this.search, [this.barChartOption, this.barChartOption2]);
            }
            else if (s.ClassType == ClassTypeEnum.Division) {
                const response = await this.divisionService.statisticNumberListV2(requsetParam as any).toPromise();
                this.convertBarData(response.Data, this.search, [this.barChartOption, this.barChartOption2]);
            }
        }
    }

    getRequsetParam(search: SearchControl): GetDivisionStatisticNumbersParamsV2 | GetGarbageStationStatisticNumbersParamsV2 {
        const s = search.toSearchParam();

        if (s.ClassType == ClassTypeEnum.Division) {
            const param = new GetDivisionStatisticNumbersParamsV2();
            param.DivisionIds = [s.DivisionId1, s.DivisionId2];
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
            return param;
        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            const param = new GetGarbageStationStatisticNumbersParamsV2();
            param.GarbageStationIds = [s.StationId1, s.StationId2];
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
            return param;
        }
    }

    convertBarData(statistic: Array<GarbageStationNumberStatisticV2> | Array<DivisionNumberStatisticV2>
        , search: SearchControl
        , opts: Array<BarOpt>[]) {
        const s = search.toSearchParam(), toPercent = (val: number, maxPercent: number, color: string) => {
            val = val || 0;console.log(maxPercent);
            
            if (val == 0) return { percent: '1%', text: 0, color: color };
            else return {
                percent: Percentage(val, maxPercent) + 1 + '%',
                text: val,
                color: color
            }
        },maxVal=(vals:number[])=>{
          return  vals.sort((a,b)=>{
                return b-a;
            }).pop();
        }; 

        const fillBarOpt = (data: BarOptData, opt: Array<BarOpt>
            , compare: BarOptData) => {
            if (s.TimeUnit == TimeUnitEnum.Hour) {
                opt[0] = toPercent(data.illegalDrop,data.illegalDrop+compare.illegalDrop, this.colors[0]);
                opt[1] = toPercent(data.mixedInto, data.mixedInto+compare.mixedInto, this.colors[0]);
                opt[2] = {
                    percent: '1%',
                    text: 0,
                    color: this.colors[0]
                }
                opt[3] = toPercent(data.dryVolume, data.dryVolume+compare.dryVolume, this.colors[0]);
                opt[4] = toPercent(data.wetVolume, data.wetVolume+compare.wetVolume, this.colors[0]);
            }
            else if (s.TimeUnit == TimeUnitEnum.Day) {
                opt[0] = toPercent(data.illegalDrop, data.illegalDrop+compare.illegalDrop, this.colors[0]);
                opt[1] = toPercent(data.mixedInto,data.mixedInto+compare.mixedInto, this.colors[0]);
                opt[2] = {
                    percent: '1%',
                    text: 0,
                    color: data.fullDuration > compare.fullDuration ? this.colors[1] : this.colors[0]
                }
                opt[3] = toPercent(data.dryVolume,data.dryVolume+compare.dryVolume, this.colors[0]);
                opt[4] = toPercent(data.wetVolume, data.wetVolume+compare.wetVolume, this.colors[0]);
            }

            opt[0].color = data.illegalDrop > compare.illegalDrop ? this.colors[1] : this.colors[0];
            opt[1].color = data.mixedInto > compare.mixedInto ? this.colors[1] : this.colors[0];
            opt[3].color = data.dryVolume > compare.dryVolume ? this.colors[1] : this.colors[0];
            opt[4].color = data.wetVolume > compare.wetVolume ? this.colors[1] : this.colors[0];

        }
        if (s.ClassType == ClassTypeEnum.Division) {
            const statistic_ = statistic as Array<DivisionNumberStatisticV2>
                , statisticG1 = statistic_.filter(x => x.Id == s.DivisionId1),
                statisticG2 = statistic_.filter(x => x.Id == s.DivisionId2),
                barOptDataG1 = new BarOptData(),
                barOptDataG2 = new BarOptData(),
                fillData = (data: Array<DivisionNumberStatisticV2>, barOptData: BarOptData) => {
                    data.map(m => {
                        m.EventNumbers.map(d => {
                            if (d.EventType == EventTypeEnum.IllegalDrop)
                                barOptData.illegalDrop += d.DayNumber;

                            else if (d.EventType == EventTypeEnum.MixedInto)
                                barOptData.mixedInto += d.DayNumber;
                        });
                        barOptData.wetVolume += m.WetVolume;
                        barOptData.dryVolume += m.DryVolume;
                    });
                };
            fillData(statisticG1, barOptDataG1);
            fillData(statisticG2, barOptDataG2);
            fillBarOpt(barOptDataG1, opts[0], barOptDataG2);
            fillBarOpt(barOptDataG2, opts[1], barOptDataG1);

        }
        else if (s.ClassType == ClassTypeEnum.Station) {
            const statistic_ = statistic as Array<GarbageStationNumberStatisticV2> 
            , statisticG1 = statistic_.filter(x => x.Id == s.StationId1),
            statisticG2 = statistic_.filter(x => x.Id == s.StationId2),
            barOptDataG1 = new BarOptData(),
            barOptDataG2 = new BarOptData(),
            fillData = (data: Array<GarbageStationNumberStatisticV2>, barOptData: BarOptData) => {
                data.map(m => {
                    m.EventNumbers.map(d => {
                        if (d.EventType == EventTypeEnum.IllegalDrop)
                            barOptData.illegalDrop += d.DayNumber;

                        else if (d.EventType == EventTypeEnum.MixedInto)
                            barOptData.mixedInto += d.DayNumber;
                    });
                    barOptData.wetVolume += m.WetVolume;
                    barOptData.dryVolume += m.DryVolume;
                });
            };
        fillData(statisticG1, barOptDataG1);
        fillData(statisticG2, barOptDataG2); 
        fillBarOpt(barOptDataG1, opts[0], barOptDataG2);
        fillBarOpt(barOptDataG2, opts[1], barOptDataG1);
            
        }
        console.log(this.barChartOption, this.barChartOption2);

    }


}

class BarOpt {
    text: string | number;
    percent: string;
    color: string;
    constructor(text: string | number, percent: string, color: string) {
        this.text = text;
        this.percent = percent;
        this.color = color;
    }
}

class BarOptData {
    illegalDrop: number;
    mixedInto: number;
    dryVolume: number;
    wetVolume: number;
    fullDuration: number;
    constructor() {
        this.mixedInto = 0;
        this.illegalDrop = 0;
        this.dryVolume = 0;
        this.wetVolume = 0;
        this.fullDuration = 0;
    }
}