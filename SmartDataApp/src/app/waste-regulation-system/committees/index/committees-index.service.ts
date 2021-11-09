import { Injectable } from "@angular/core";
import { GetVodUrlParams } from "src/app/data-core/model/aiop/video-url";
import { GetGarbageStationsParams } from "src/app/data-core/model/waste-regulation/garbage-station";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { GarbageStationRequestService } from "src/app/data-core/repuest/garbage-station.service";
import { StationResourceSRServersRequestService } from "src/app/data-core/repuest/resources.service";

@Injectable()
export class CommitteesIndexService {
  constructor(
    private divisionService: DivisionRequestService,
    private stationService: GarbageStationRequestService,
    private srService: StationResourceSRServersRequestService
  ) {}

  getDivision(id: string) {
    return this.divisionService.get(id);
  }

  getGarbageStations(divisionId: string) {
    let params = new GetGarbageStationsParams();
    params.DivisionId = divisionId;
    return this.stationService.list(params);
  }

  async getVideoUrl(begin: Date, end: Date, cameraId: string) {
    const params = new GetVodUrlParams();
    params.BeginTime = begin;
    params.EndTime = end;
    params.Protocol = "ws-ps";
    params.StreamType = 1;
    params.CameraId = cameraId;
    let response = await this.srService.VodUrls(params);
    return response.Data;
  }
}
