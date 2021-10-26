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
import { IllegalDropEventRequestService } from "../../../../data-core/repuest/Illegal-drop-event-record";
import { GetEventRecordsParams } from "../../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { DivisionType } from "src/app/data-core/model/enum";

@Injectable({
  providedIn: "root",
})
export class StatisticalDataBufferService
  extends ListAttribute
  implements IBusinessService
{
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
    private eventRequestService: IllegalDropEventRequestService
  ) {
    super();
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
    const param = new GetGarbageStationsParams();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    param.DivisionId = divisionsId;
    const response = await this.garbageStationService.list(param);
    return response.Data;
  }

  async getDivisionEventNumbers(divisionsId: string, timeUnit: TimeUnitEnum) {
    const param = new GetDivisionEventNumbersParams(),
      dayTime = TheDayTime(new Date());
    param.TimeUnit = timeUnit;
    param.BeginTime = dayTime.begin.toISOString();
    param.EndTime = dayTime.end.toISOString();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    const response = await this.divisionService.eventNumbersHistory(
      param,
      divisionsId
    );
    return response.Data;
  }

  getDivisionStatisticNumber(divisionsId: string) {
    return this.divisionService.statisticNumber(divisionsId);
  }
  postDivisionStatisticNumbers(
    divisionsIds: string[]
  ): Promise<DivisionNumberStatistic[]>;
  async postDivisionStatisticNumbers(args: string[]) {
    const param = new GetDivisionStatisticNumbersParams();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    param.Ids = args;
    const response = await this.divisionService.statisticNumberList(param);
    return response.Data;
  }
  async getDivisions(divisionId?: string) {
    let params: GetDivisionsParams | undefined = undefined;
    if (divisionId) {
      params = new GetDivisionsParams();
      params.Ids = [divisionId];
    }
    const response = await this.divisionService.list(params);
    return response.Data;
  }

  async getDivision(divisionId: string) {
    return this.divisionService.get(divisionId);
  }

  /**根据ids 获取区划 */
  async getAncestorDivisions(ancestorId: string, type?: DivisionType) {
    const param = new GetDivisionsParams();
    param.PageIndex = 1;

    param.PageSize = this.maxSize;
    param.AncestorId = ancestorId;
    if (type) {
      param.DivisionType = type;
    }
    const response = await this.divisionService.list(param);
    let result = response.Data;

    return result;
  }
  postGarbageStationStatisticNumbers(
    stationIds: string[]
  ): Promise<GarbageStationNumberStatistic[]>;
  postGarbageStationStatisticNumbers(
    divisionId: string
  ): Promise<GarbageStationNumberStatistic[]>;

  async postGarbageStationStatisticNumbers(stationIds: string[] | string) {
    if (Array.isArray(stationIds)) {
      const param = new GetGarbageStationStatisticNumbersParams();

      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      param.Ids = stationIds;
      const response = await this.garbageStationService.statisticNumberList(
        param
      );
      return response.Data;
    } else {
      const param = new GetGarbageStationStatisticNumbersParams();
      param.PageSize = this.maxSize;
      param.DivisionId = stationIds;
      const response = await this.garbageStationService.statisticNumberList(
        param
      );
      return response.Data;
    }
  }

  /**
   * 垃圾房的数量统计信息
   */
  async stationNumberStatistic(stationIds: Array<string>) {
    const param = new GetGarbageStationStatisticNumbersParamsV2(),
      day = TheDayTime(new Date());
    param.TimeUnit = 2;
    param.BeginTime = day.begin.toISOString();
    param.EndTime = day.end.toISOString();
    param.GarbageStationIds = stationIds;
    return this.garbageStationService.statisticNumberListV2(param);
  }
}

export enum TimeUnitEnum {
  Hour = 1,
  Day,
}
