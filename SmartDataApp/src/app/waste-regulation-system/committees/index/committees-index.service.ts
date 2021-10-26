import { Injectable } from "@angular/core";
import { GetGarbageStationsParams } from "src/app/data-core/model/waste-regulation/garbage-station";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { GarbageStationRequestService } from "src/app/data-core/repuest/garbage-station.service";

@Injectable()
export class CommitteesIndexService {
  constructor(
    private divisionService: DivisionRequestService,
    private stationService: GarbageStationRequestService
  ) {}

  getDivision(id: string) {
    return this.divisionService.get(id);
  }

  getGarbageStations(divisionId: string) {
    let params = new GetGarbageStationsParams();
    params.DivisionId = divisionId;
    return this.stationService.list(params);
  }
}
