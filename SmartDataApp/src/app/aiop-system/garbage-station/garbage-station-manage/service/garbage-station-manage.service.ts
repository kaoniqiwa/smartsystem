import { Injectable } from "@angular/core";
import { GarbageStationCamera } from "src/app/data-core/model/aiop/garbage-station-camera.model";
import { GarbageStation } from "src/app/data-core/model/aiop/garbage-station.model";
import { RequestGarbageStationsService } from "src/app/data-core/repuest/garbage-stations.service";
@Injectable()
export class GarbageStationManageService {
  constructor(private _garbageStationsService: RequestGarbageStationsService) {}
  async createGarbageStation(item: GarbageStation) {
    const result = await this._garbageStationsService.create(item);
    return result.Data;
  }

  async delGarbageStation(stationId: string) {
    const result = await this._garbageStationsService.delete(stationId);
    return result.Data;
  }

  async editGarbageStation(item: GarbageStation) {
    // const result = this._garbageStationsService.set(item);
    // return result;
  }
  async addCameraToGarbageStation(camera: GarbageStationCamera) {
    const result = await this._garbageStationsService.addCamera(camera);
    return result.Data;
  }
}
