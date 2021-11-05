import { Injectable } from "@angular/core";
import { TheDayTime } from "src/app/common/tool/tool.service";
import { TimeUnit } from "src/app/data-core/model/enum";
import {
  EventNumberStatistic,
  GetDivisionEventNumbersParams,
  GetGarbageStationnEventNumbersParams,
} from "src/app/data-core/model/waste-regulation/division-event-numbers";
import {
  DivisionNumberStatistic,
  DivisionNumberStatisticV2,
  GetDivisionStatisticNumbersParams,
  GetDivisionStatisticNumbersParamsV2,
} from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  GarbageStationNumberStatistic,
  GetGarbageStationStatisticNumbersParams,
  GetGarbageStationStatisticNumbersParamsV2,
} from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { GarbageStationRequestService } from "src/app/data-core/repuest/garbage-station.service";
import { ICommitteesService } from "../interface/committees-service.interface";

@Injectable()
export class StatisticSummaryService
  implements ICommitteesService<DivisionNumberStatistic>
{
  constructor(
    private divisionService: DivisionRequestService,
    private stationService: GarbageStationRequestService
  ) {}

  load(divisionId: string): Promise<DivisionNumberStatistic> {
    return this.divisionService.statisticNumber(divisionId);
  }

  async stations(divisionId: string): Promise<GarbageStationNumberStatistic[]> {
    let params = new GetGarbageStationStatisticNumbersParams();
    params.DivisionId = divisionId;
    let response = await this.stationService.statisticNumberList(params);
    return response.Data;
  }

  async divisionHistory(
    divisionId: string,
    day: { begin: Date; end: Date },
    unit: TimeUnit
  ): Promise<DivisionNumberStatisticV2> {
    let params = new GetDivisionStatisticNumbersParamsV2();
    params.BeginTime = day.begin;
    params.EndTime = day.end;
    params.TimeUnit = unit;
    params.DivisionIds = [divisionId];
    let response = await this.divisionService.statisticNumberListV2(params);
    return response.pop();
  }
  async stationHistory(
    stationIds: string[],
    day: { begin: Date; end: Date },
    unit: TimeUnit
  ) {
    let params = new GetGarbageStationStatisticNumbersParamsV2();
    params.BeginTime = day.begin;
    params.EndTime = day.end;
    params.TimeUnit = unit;
    params.GarbageStationIds = stationIds;
    let response = await this.stationService.statisticNumberListV2(params);
    return response;
  }
}
