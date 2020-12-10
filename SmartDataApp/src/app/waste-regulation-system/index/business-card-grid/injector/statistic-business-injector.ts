/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Injectable, Injector } from '@angular/core';
import { BusinessParameter } from '../../../../common/interface/IBusiness';
import { IllegalDropHistory } from '../business/illegal-drop-history/illegal-drop-history';
import { GarbageInspection } from '../business/inspection/inspection';
import { DeviceStatusStatistic } from '../business/dev/device-status-statistic';
import { DivisionGarbageSpecification } from "../business/division-garbage-specification/division-garbage-specification";
import { IllegalDropOrder } from "../business/illegal-drop-order/illegal-drop-order";
import { DivisionList } from "../business/division/division-list";
import { IllegalDropEvent } from "../business/illegal-drop-event/illegal-drop-event";
import { StatisticalDataBufferService } from '../buffer/statistical-data-buffer';
import { BaseBusinessRefresh } from '../../../../common/tool/base-business-refresh';
import { DatePipe } from '@angular/common';
import { EventPushService } from "../../../../common/tool/mqtt-event/event-push.service";
import { DivisionTypeEnum } from '../../../../common/tool/enum-helper';
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
            { provide: IllegalDropHistory, useValue: new IllegalDropHistory(this.statisticalDataBufferService), deps: [] },
            { provide: DeviceStatusStatistic, useValue: new DeviceStatusStatistic(this.statisticalDataBufferService), deps: [] },
            {provide:DivisionList,useValue:new DivisionList(this.statisticalDataBufferService), deps: [] },
            {provide:IllegalDropEvent,useValue:new IllegalDropEvent(this.eventPushService), deps: [] },
            {provide:DivisionGarbageSpecification,useValue:new DivisionGarbageSpecification(this.statisticalDataBufferService), deps: []},
            {provide:IllegalDropOrder,useValue:new IllegalDropOrder(this.statisticalDataBufferService), deps: []},
            {provide:GarbageInspection,useValue:new GarbageInspection(this.statisticalDataBufferService), deps: []}
        ]);
    }

    createBusiness(businessConfig:Partial< { business: string, dataTime: number
        ,divisionsType:DivisionTypeEnum
        ,state:boolean
        , divisionsId: string,divisionsIds:string[] }>) {
        if (businessConfig.business) {
            let business = this.businessInjector.get<BaseBusinessRefresh>(CardBusinessEnum[businessConfig.business]);
            const businessParameter = new BusinessParameter();
            businessParameter.map.set('datePipe',this.datePipe);
            business.businessParameter = businessParameter;
            business.businessParameter.map.set('divisionsId', businessConfig.divisionsId);
            business.businessParameter.map.set('divisionsIds', businessConfig.divisionsIds);
            business.businessParameter.map.set('divisionsType', businessConfig.divisionsType);
            business.businessParameter.map.set('state', businessConfig.state);
            if (business.timeSpan)
                business.timeSpan.interval = businessConfig.dataTime;
            return business;
        }

    }
}

export const CardBusinessEnum = {
    "IllegalDropHistory": IllegalDropHistory,
    "DeviceStatusStatistic": DeviceStatusStatistic,
    "DivisionList":DivisionList,
    "IllegalDropEvent":IllegalDropEvent,
    "DivisionGarbageSpecification":DivisionGarbageSpecification,
    "IllegalDropOrder":IllegalDropOrder,
    "GarbageStationInspection":GarbageInspection
}