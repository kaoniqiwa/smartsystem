import { Injectable } from "@angular/core";
import { Camera } from "src/app/data-core/model/waste-regulation/camera";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  CameraRequestService as GarbageStationCameraRequestService,
  GarbageStationRequestService,
} from "src/app/data-core/repuest/garbage-station.service";
@Injectable()
export class GarbageStationManageService {
  constructor(
    private _garbageStationsService: GarbageStationRequestService,
    private _cameraRequestService: GarbageStationCameraRequestService
  ) {}
  async createGarbageStation(item: GarbageStation) {
    const result = await this._garbageStationsService.create(item);
    return result;
  }

  async delGarbageStation(stationId: string) {
    const result = await this._garbageStationsService.del(stationId);
    return result;
  }

  async editGarbageStation(item: GarbageStation) {
    const result = this._garbageStationsService.set(item);
    return result;
  }
  async getGarbageStation(id: string) {
    const result = await this._garbageStationsService.get(id);
    return result;
  }
  async addCameraToGarbageStation(camera: Camera) {
    const result = await this._cameraRequestService.create(camera);
    return result;
  }
  // 列出当前垃圾厢房下的摄像机列表
  async listCameras(garbageStationId: string) {
    const result = await this._cameraRequestService.list(garbageStationId);
    return result;
  }
}
