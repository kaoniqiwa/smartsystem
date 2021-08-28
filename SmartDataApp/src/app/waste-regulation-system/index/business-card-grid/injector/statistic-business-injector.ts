/**
 * Developer 施文斌
 * LastUpdateTime  21/3/12
 */
import { Injectable, Injector } from "@angular/core";
import { BusinessParameter } from "../../../../common/interface/IBusiness";
import { EventDropHistory } from "../business/event-drop-history/event-drop-history";
import { IllegalDropHistory } from "../business/illegal-drop-history/illegal-drop-history";
import { GarbageInspection } from "../business/inspection/inspection";
import { DeviceStatusStatistic } from "../business/dev/device-status-statistic";
import { DivisionGarbageSpecification } from "../business/division-garbage-specification/division-garbage-specification";
import {
  EventDropOrder,
  EventDropOrderB,
} from "../business/event-drop-order/event-drop-order";
import { DivisionList } from "../business/division/division-list";
import { GarbageDisposalRankService } from "../business/garbage-disposal-rank/garbage-disposal-rank.service";
import { IllegalDropEvent } from "../business/illegal-drop-event/illegal-drop-event";
import { StatisticalDataBufferService } from "../buffer/statistical-data-buffer";
import { BaseBusinessRefresh } from "../../../../common/tool/base-business-refresh";
import { DatePipe } from "@angular/common";
import { EventPushService } from "../../../../common/tool/mqtt-event/event-push.service";
import { DivisionType, EventType } from "../../../../data-core/model/enum";
import { GarbageTaskNumberBusiness } from "../business/garbage-task-number/garbage-task-number.business";
import { GarbageRetentionRankBusiness } from "../business/garbage-retention-rank/garbage-retention-rank.business";
@Injectable({
  providedIn: "root",
})
export class StatisticBusinessInjector {
  businessRefreshInjector: Injector;
  businessInjector: Injector;
  constructor(
    private datePipe: DatePipe,
    private eventPushService: EventPushService,
    private statisticalDataBufferService: StatisticalDataBufferService
  ) {
    const businessParameter = new BusinessParameter();
    businessParameter.datePipe = this.datePipe;
    this.businessInjector = Injector.create([
      {
        provide: EventDropHistory,
        useValue: new EventDropHistory(this.statisticalDataBufferService),
        deps: [],
      },
      {
        provide: IllegalDropHistory,
        useValue: new IllegalDropHistory(this.statisticalDataBufferService),
        deps: [],
      },
      {
        provide: DeviceStatusStatistic,
        useValue: new DeviceStatusStatistic(this.statisticalDataBufferService),
        deps: [],
      },
      {
        provide: DivisionList,
        useValue: new DivisionList(this.statisticalDataBufferService),
        deps: [],
      },
      {
        provide: IllegalDropEvent,
        useValue: new IllegalDropEvent(this.eventPushService),
        deps: [],
      },
      {
        provide: DivisionGarbageSpecification,
        useValue: new DivisionGarbageSpecification(
          this.statisticalDataBufferService
        ),
        deps: [],
      },
      {
        provide: EventDropOrder,
        useValue: new EventDropOrder(this.statisticalDataBufferService),
        deps: [],
      },
      {
        provide: EventDropOrderB,
        useValue: new EventDropOrderB(this.statisticalDataBufferService),
        deps: [],
      },
      {
        provide: GarbageInspection,
        useValue: new GarbageInspection(this.statisticalDataBufferService),
        deps: [],
      },
      {
        provide: GarbageDisposalRankService,
        useValue: new GarbageDisposalRankService(
          this.statisticalDataBufferService
        ),
        deps: [],
      },
      {
        provide: GarbageTaskNumberBusiness,
        useValue: new GarbageTaskNumberBusiness(
          this.statisticalDataBufferService
        ),
        deps: [],
      },
      {
        provide: GarbageRetentionRankBusiness,
        useValue: new GarbageRetentionRankBusiness(
          this.statisticalDataBufferService
        ),
        deps: [],
      },
    ]);
  }

  createBusiness(
    businessConfig: Partial<{
      business: string;
      dataTime: number;
      divisionType: DivisionType;
      state: boolean;
      eventType: EventType;
      stationId: string;
      divisionId: string;
      divisionsIds: string[];
    }>
  ) {
    if (businessConfig.business) {
      let business = this.businessInjector.get<BaseBusinessRefresh>(
        CardBusinessEnum[businessConfig.business]
      );
      const businessParameter = new BusinessParameter();
      businessParameter.datePipe = this.datePipe;
      business.businessParameter = businessParameter;
      business.businessParameter.divisionId = businessConfig.divisionId;
      business.businessParameter.divisionsIds = businessConfig.divisionsIds;
      business.businessParameter.divisionType = businessConfig.divisionType;
      business.businessParameter.state = businessConfig.state;
      business.businessParameter.stationId = businessConfig.stationId;
      business.businessParameter.eventType = businessConfig.eventType;

      if (business.timeSpan)
        business.timeSpan.interval = businessConfig.dataTime;
      return business;
    }
  }
}

export const CardBusinessEnum = {
  IllegalDropHistory: IllegalDropHistory,
  MixedIntoHistory: EventDropHistory,
  DeviceStatusStatistic: DeviceStatusStatistic,
  DivisionList: DivisionList,
  IllegalDropEvent: IllegalDropEvent,
  DivisionGarbageSpecification: DivisionGarbageSpecification,
  EventDropOrder: EventDropOrder,
  // "MixedIntoDropOrder":EventDropOrderB,
  GarbageStationInspection: GarbageInspection,
  GarbageDisposalRank: GarbageDisposalRankService,
  GarbageTaskNumberBusiness: GarbageTaskNumberBusiness,
  GarbageRetentionRankBusiness: GarbageRetentionRankBusiness,
};
