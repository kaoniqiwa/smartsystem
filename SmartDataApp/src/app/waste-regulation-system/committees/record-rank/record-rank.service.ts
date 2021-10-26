import { Injectable } from "@angular/core";
import {
  GarbageStationNumberStatistic,
  GetGarbageStationStatisticNumbersParams,
} from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { GarbageStationRequestService } from "src/app/data-core/repuest/garbage-station.service";
import { ICommitteesService } from "../interface/committees-service.interface";

@Injectable()
export class RecordRankService
  implements ICommitteesService<GarbageStationNumberStatistic[]>
{
  constructor(private stationService: GarbageStationRequestService) {}

  async load(divisionId: string) {
    let params = new GetGarbageStationStatisticNumbersParams();
    params.DivisionId = divisionId;
    params.PageSize = 999;
    let list = await this.stationService.statisticNumberList(params);
    return list.Data;
  }
}
