import { Injectable } from "@angular/core";
import { AppCaChe } from "../../../../common/tool/app-cache/app-cache";
import { IBusinessService } from "../../../../common/interface/IDataBuffer";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import {
  EventNumberStatistic,
  GetDivisionEventNumbersParams,
} from "../../../../data-core/model/waste-regulation/division-event-numbers";
import { TheDayTime } from "../../../../common/tool/tool.service";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import {
  DivisionNumberStatistic,
  GetDivisionStatisticNumbersParams,
} from "../../../../data-core/model/waste-regulation/division-number-statistic";
import {
  Division,
  GetDivisionsParams,
} from "../../../../data-core/model/waste-regulation/division";
import { Md5 } from "ts-md5/dist/md5";
import {
  GarbageStationNumberStatistic,
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticNumbersParamsV2,
} from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { GetGarbageStationStatisticNumbersParams } from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import {
  GarbageStation,
  GetGarbageStationsParams,
} from "../../../../data-core/model/waste-regulation/garbage-station";
import { EventRequestService } from "../../../../data-core/repuest/Illegal-drop-event-record";
import { GetEventRecordsParams } from "../../../../data-core/model/waste-regulation/illegal-drop-event-record";

@Injectable({
  providedIn: "root",
})
export class StatisticalDataBufferService
  extends ListAttribute
  implements IBusinessService
{
  cache = new AppCaChe(58 * 1000);

  readonly eventNumbersHistory = "EventNumbersHistory_";
  readonly statisticNumber = "StatisticNumber_";
  readonly divisionStatisticNumberList = "DivisionStatisticNumberList_";
  readonly garbageStationStatisticNumberList =
    "GarbageStationStatisticNumberList_";
  readonly division = "Division";
  readonly garbageStation = "GarbageStation_";
  readonly ancestorIdDivisions = "AncestorIdDivisions_";
  readonly divisionId = "DivisionId_";
  readonly stationStatisticNumber_ = "StationStatisticNumber_";
  constructor(
    private divisionService: DivisionRequestService,
    private garbageStationService: GarbageStationRequestService,
    private eventRequestService: EventRequestService
  ) {
    super();
  }

  cacheReset() {
    this.cache.reset();
  }

  getStationsIllegalDropEvent(stationIds: string[]) {
    const param = new GetEventRecordsParams(),
      day = TheDayTime(new Date());
    param.PageIndex = 1;
    param.BeginTime = day.begin.toISOString();
    param.EndTime = day.end.toISOString();
    param.PageSize = this.maxSize;
    param.StationIds = stationIds;
    return this.eventRequestService.list(param);
  }

  async getGarbageStations(divisionsId: string) {
    var result = this.cache.get<GarbageStation[]>(
      (this.garbageStation + Md5.hashStr(divisionsId)) as string
    );
    if (!result) {
      const param = new GetGarbageStationsParams();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      param.DivisionId = divisionsId;
      const response = await this.garbageStationService.list(param);
      result = response.Data.Data;
      this.cache.set(this.garbageStation, result);
    }
    return result;
  }

  async getDivisionEventNumbers(divisionsId: string, timeUnit: TimeUnitEnum) {
    var result = this.cache.get<EventNumberStatistic[]>(
      this.eventNumbersHistory + timeUnit + "$" + divisionsId
    );
    if (!result) {
      const param = new GetDivisionEventNumbersParams(),
        dayTime = TheDayTime(new Date());
      param.TimeUnit = timeUnit;
      param.BeginTime = dayTime.begin.toISOString();
      param.EndTime = dayTime.end.toISOString();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      const response = await this.divisionService
        .eventNumbersHistory(param, divisionsId)
        .toPromise();
      result = response.Data.Data;
      this.cache.set(this.eventNumbersHistory + divisionsId, result);
    }
    return result;
  }

  async getDivisionStatisticNumber(divisionsId: string) {
    var result = this.cache.get<DivisionNumberStatistic>(
      this.statisticNumber + divisionsId
    );
    if (!result) {
      const response = await this.divisionService
        .statisticNumber(divisionsId)
        .toPromise();
      result = response.Data;
      this.cache.set(this.statisticNumber + divisionsId, result);
    }
    return result;
  }

  async postDivisionStatisticNumbers(divisionsIds: string[]) {
    var result = this.cache.get<DivisionNumberStatistic[]>(
      this.divisionStatisticNumberList + Md5.hashStr(divisionsIds.join("-"))
    );
    if (!result) {
      const param = new GetDivisionStatisticNumbersParams();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      param.Ids = divisionsIds;
      const response = await this.divisionService
        .statisticNumberList(param)
        .toPromise();
      result = response.Data.Data;

      this.cache.set(
        this.divisionStatisticNumberList + Md5.hashStr(divisionsIds.join("-")),
        result
      );
    }
    return result;
  }

  async getDivisions() {
    var result = this.cache.get<Division[]>(this.division);
    if (!result) {
      const param = new GetDivisionsParams();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      const response = await this.divisionService.list(param).toPromise();
      result = response.Data.Data;
      this.cache.set(this.division, result);
    }
    return result;
  }

  /**根据ids 获取区划 */
  async ancestorDivisions(ancestorId: string, divisionId?: string) {
    const param = new GetDivisionsParams();
    param.PageIndex = 1;
    if (divisionId) {
      var result1 = this.cache.get<Division[]>(
        this.divisionId + Md5.hashStr(divisionId)
      );
      if (!result1) {
        param.PageSize = 1;
        param.Ids = [divisionId];
        const response = await this.divisionService.list(param).toPromise();
        result1 = response.Data.Data;
        this.cache.set(this.divisionId + Md5.hashStr(divisionId), result);
      }
      return result1;
    } else {
      var result = this.cache.get<Division[]>(
        this.ancestorIdDivisions + Md5.hashStr(ancestorId)
      );
      if (!result) {
        param.PageSize = this.maxSize;
        param.AncestorId = ancestorId;
        const response = await this.divisionService.list(param).toPromise();
        result = response.Data.Data;
        this.cache.set(
          this.ancestorIdDivisions + Md5.hashStr(ancestorId),
          result
        );
      }
      return result;
    }
  }

  async postGarbageStationStatisticNumbers(divisionsIds: string[]) {
    var result = this.cache.get<GarbageStationNumberStatistic[]>(
      this.garbageStationStatisticNumberList +
        Md5.hashStr(divisionsIds.join("-"))
    );
    if (!result) {
      const param = new GetGarbageStationStatisticNumbersParams();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      param.Ids = divisionsIds;
      const response = await this.garbageStationService
        .statisticNumberList(param)
        .toPromise();
      result = response.Data.Data;
      this.cache.set(
        this.garbageStationStatisticNumberList +
          Md5.hashStr(divisionsIds.join("-")),
        result
      );
    }
    return result;
  }

  /**
   * 垃圾房的数量统计信息
   */
  async stationNumberStatistic(stationIds: Array<string>) {
    var result = this.cache.get<GarbageStationNumberStatisticV2[]>(
      this.stationStatisticNumber_ + Md5.hashStr(stationIds.join(","))
    );
    if (!result) {
      const param = new GetGarbageStationStatisticNumbersParamsV2(),
        day = TheDayTime(new Date());
      param.TimeUnit = 2;
      param.BeginTime = day.begin.toISOString();
      param.EndTime = day.end.toISOString();
      param.GarbageStationIds = stationIds;
      const statisticNumbers2 = await this.garbageStationService
        .statisticNumberListV2(param)
        .toPromise();
      result = statisticNumbers2.Data;
      this.cache.set(
        this.garbageStationStatisticNumberList +
          Md5.hashStr(stationIds.join(",")),
        result
      );
    }
    return result;
  }
}

export enum TimeUnitEnum {
  Hour = 1,
  Day,
}
