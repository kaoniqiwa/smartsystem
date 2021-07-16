import {
  GarbageStation,
  GetGarbageStationsParams,
} from "../model/waste-regulation/garbage-station";
import { GarbageStationRequestService } from "../repuest/garbage-station.service";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { GetGarbageStationStatisticNumbersParams } from "../model/waste-regulation/garbage-station-number-statistic";
import { AppCaChe } from "../../common/tool/app-cache/app-cache";
import { Injectable } from "@angular/core";

@Injectable()
export class GarbageStationDao extends ListAttribute {
  cache = new AppCaChe(60 * 30 * 1000);
  readonly garbageStation = "GarbageStation";
  readonly divisionStations = "divisionStations";
  constructor(private requestService: GarbageStationRequestService) {
    super();
    this.cache.set(this.divisionStations, new Map<string, GarbageStation[]>());
  }

  async allGarbageStations() {
    var result = this.cache.get<GarbageStation[]>(this.garbageStation);
    if (!result) {
      const param = new GetGarbageStationsParams();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      const response = await this.requestService.list(param);
      this.cache.set(this.garbageStation, response.Data);
      result = response.Data;
    }
    return result;
  }

  async requestGarbageStation(ancestorId: string) {
    var cacheData = this.cache.get<Map<string, GarbageStation[]>>(
      this.divisionStations
    );
    if (cacheData.has(ancestorId)) {
      return cacheData.get(ancestorId);
    } else {
      const param = new GetGarbageStationsParams();
      param.PageIndex = 1;
      param.AncestorId = ancestorId;
      param.PageSize = new ListAttribute().maxSize;
      const response = await this.requestService.list(param);
      cacheData.set(ancestorId, response.Data);
      this.cache.set(this.divisionStations, cacheData);
      return response.Data;
    }
  }

  async allGarbageStationsStatistic() {
    const param = new GetGarbageStationStatisticNumbersParams();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    const result = await this.requestService.statisticNumberList(param);
    return result.Data;
  }

  manualCapture(stationId: string) {
    return this.requestService.manualCapture(stationId);
  }
}
