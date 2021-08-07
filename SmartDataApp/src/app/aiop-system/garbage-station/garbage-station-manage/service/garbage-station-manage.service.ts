import { Injectable } from "@angular/core";
import { GarbageStation } from "src/app/data-core/model/aiop/garbage-station.model";
import { RequestGarbageStationsService } from "src/app/data-core/repuest/garbage-stations.service";
@Injectable()
export class GarbageStationManageService {
  constructor(private _garbageStationsService: RequestGarbageStationsService) {}
  async createGarbageStation(item: GarbageStation) {
    const result = await this._garbageStationsService.create(item);
    return result;
  }

  async delGarbageStation(stationId: string) {
    // const result = await this._garbageStationsService.del(stationId);
    // return !!result;
  }

  async editGarbageStation(item: GarbageStation) {
    // const result = this._garbageStationsService.set(item);
    // return result;
  }
}
