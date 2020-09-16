
import { Injectable } from '@angular/core';
import { AppCaChe } from '../../../../common/tool/app-cache/app-cache';
import { IBusinessService } from '../../../../common/interface/IDataBuffer';
import { DivisionRequestService } from '../../../../data-core/repuest/division.service';
import { EventNumberStatistic, GetDivisionEventNumbersParams } from '../../../../data-core/model/waste-regulation/division-event-numbers';
import { TheDayTime } from '../../../../common/tool/tool.service';
import { ListAttribute } from '../../../../common/tool/table-form-helper'; 
import { DivisionNumberStatistic } from '../../../../data-core/model/waste-regulation/division-number-statistic';
import { Division, GetDivisionsParams } from '../../../../data-core/model/waste-regulation/division';
@Injectable({
    providedIn: 'root'
})
export class StatisticalDataBufferService extends ListAttribute implements IBusinessService {

    cache = new AppCaChe(60 * 1000);

    readonly eventNumbersHistory = 'EventNumbersHistory_';
    readonly statisticNumber = 'StatisticNumber_';
    readonly division = 'Division';
    constructor(private divisionService: DivisionRequestService) {
        super();
    }
    async getDivisionEventNumbers(divisionsId: string, timeUnit: TimeUnitEnum) {
        var result = this.cache.get<EventNumberStatistic[]>(this.eventNumbersHistory + timeUnit + '$' + divisionsId);
        if (!result) {
            const param = new GetDivisionEventNumbersParams(), dayTime = TheDayTime(new Date());
            param.TimeUnit = timeUnit;
            param.BeginTime = dayTime.begin.toISOString();
            param.EndTime = dayTime.end.toISOString();
            param.PageIndex = 1;
            param.PageSize = this.maxSize;
            const response = await this.divisionService.eventNumbersHistory(param, divisionsId).toPromise();
            result = response.Data.Data; 
            this.cache.set(this.eventNumbersHistory + divisionsId, response.Data.Data);
        }
        return result;

    }

    async getDivisionStatisticNumber(divisionsId: string) {
        var result = this.cache.get<DivisionNumberStatistic>(this.eventNumbersHistory  + divisionsId);
        if (!result) { 
            const response = await this.divisionService.statisticNumber(divisionsId).toPromise();
            result = response.Data; 
            this.cache.set(this.eventNumbersHistory + divisionsId, response.Data);
        }
        return result;
    }

    async getDivisions(){
        var result = this.cache.get<Division[]>(this.division);
        if (!result) { 
            const param = new GetDivisionsParams();
            param.PageIndex=1;
            param.PageSize = this.maxSize;
            const response =  await this.divisionService.list(param).toPromise();
            result=response.Data.Data;
        }
        return result;       
    }
}


export enum TimeUnitEnum {
    Hour = 1,
    Day
}