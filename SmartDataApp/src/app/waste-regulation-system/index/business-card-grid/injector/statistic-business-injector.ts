/**
 * Developer 施文斌
 * LastUpdateTime  21/3/12
 */
import { Injectable, Injector } from '@angular/core';
import { BusinessParameter } from '../../../../common/interface/IBusiness';
import { EventDropHistory } from '../business/event-drop-history/event-drop-history';
import { IllegalDropHistory} from '../business/illegal-drop-history/illegal-drop-history';
import { GarbageInspection } from '../business/inspection/inspection';
import { DeviceStatusStatistic } from '../business/dev/device-status-statistic';
import { DivisionGarbageSpecification } from "../business/division-garbage-specification/division-garbage-specification";
import { EventDropOrder,EventDropOrderB } from "../business/event-drop-order/event-drop-order";
import { DivisionList } from "../business/division/division-list";
import { StationDisposeScore } from "../business/station-dispose-score/station-dispose-score";
import { IllegalDropEvent } from "../business/illegal-drop-event/illegal-drop-event";
import { StatisticalDataBufferService } from '../buffer/statistical-data-buffer';
import { BaseBusinessRefresh } from '../../../../common/tool/base-business-refresh';
import { DatePipe } from '@angular/common';
import { EventPushService } from "../../../../common/tool/mqtt-event/event-push.service";
import { DivisionTypeEnum,EventTypeEnum } from '../../../../common/tool/enum-helper';
@Injectable({
    providedIn: 'root'
})
export class StatisticBusinessInjector {

    businessRefreshInjector: Injector;
    businessInjector: Injector;
    constructor(
        private datePipe:DatePipe,
        private eventPushService:EventPushService,
        private statisticalDataBufferService: StatisticalDataBufferService) {
        const businessParameter = new BusinessParameter();
        businessParameter.map.set('datePipe',this.datePipe);
        this.businessInjector = Injector.create([
            { provide: EventDropHistory, useValue: new EventDropHistory(this.statisticalDataBufferService), deps: [] },
            { provide: IllegalDropHistory, useValue: new IllegalDropHistory(this.statisticalDataBufferService), deps: [] },
            { provide: DeviceStatusStatistic, useValue: new DeviceStatusStatistic(this.statisticalDataBufferService), deps: [] },
            {provide:DivisionList,useValue:new DivisionList(this.statisticalDataBufferService), deps: [] },
            {provide:IllegalDropEvent,useValue:new IllegalDropEvent(this.eventPushService), deps: [] },
            {provide:DivisionGarbageSpecification,useValue:new DivisionGarbageSpecification(this.statisticalDataBufferService), deps: []},
            {provide:EventDropOrder,useValue:new EventDropOrder(this.statisticalDataBufferService), deps: []},
            {provide:EventDropOrderB,useValue:new EventDropOrderB(this.statisticalDataBufferService), deps: []},
            {provide:GarbageInspection,useValue:new GarbageInspection(this.statisticalDataBufferService), deps: []},
            {provide:StationDisposeScore,useValue:new StationDisposeScore(this.statisticalDataBufferService), deps: []}
        ]);
    }

    createBusiness(businessConfig:Partial< { business: string, dataTime: number
        ,divisionType:DivisionTypeEnum
        ,state:boolean,eventType:EventTypeEnum,stationId:string
        , divisionId: string,divisionsIds:string[] }>) {
        if (businessConfig.business) { 
            let business = this.businessInjector.get<BaseBusinessRefresh>(CardBusinessEnum[businessConfig.business]);
            const businessParameter = new BusinessParameter();
            businessParameter.map.set('datePipe',this.datePipe);
            business.businessParameter = businessParameter;
            business.businessParameter.map.set('divisionId', businessConfig.divisionId);
            business.businessParameter.map.set('divisionsIds', businessConfig.divisionsIds);
            business.businessParameter.map.set('divisionType', businessConfig.divisionType);
            business.businessParameter.map.set('state', businessConfig.state);
            business.businessParameter.map.set('stationId', businessConfig.stationId);
            business.businessParameter.map.set('eventType', businessConfig.eventType);
         
            if (business.timeSpan)
                business.timeSpan.interval = businessConfig.dataTime;
            return business;
        }

    }
}

export const CardBusinessEnum = {
    "IllegalDropHistory": IllegalDropHistory,
    "MixedIntoHistory": EventDropHistory,
    "DeviceStatusStatistic": DeviceStatusStatistic,
    "DivisionList":DivisionList,
    "IllegalDropEvent":IllegalDropEvent,
    "DivisionGarbageSpecification":DivisionGarbageSpecification,
    "DropOrder":EventDropOrder,
    // "MixedIntoDropOrder":EventDropOrderB,
    "GarbageStationInspection":GarbageInspection,
    "StationDisposeScore":StationDisposeScore
}