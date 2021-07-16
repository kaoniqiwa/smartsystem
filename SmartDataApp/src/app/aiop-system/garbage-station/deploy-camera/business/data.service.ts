import { Injectable } from "@angular/core";
import { CameraRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import {
  Camera,
  GetGarbageStationCamerasParams,
} from "../../../../data-core/model/waste-regulation/camera";
@Injectable()
export class DataService {
  cameras = new Array<Camera>();
  constructor(private cameraRequestService: CameraRequestService) {}

  async getStationCameras(stationId: string) {
    const result = await this.cameraRequestService.list(stationId);
    return result;
  }

  async addStationCamera(item: Camera) {
    const result = await this.cameraRequestService.create(item);
    return !!result;
  }

  async getCamera(stationId: string, cameraId: string) {
    const param = new GetGarbageStationCamerasParams();

    param.PageIndex = 1;
    param.PageSize = new ListAttribute().maxSize;
    if (stationId) param.GarbageStationIds = [stationId];
    if (cameraId) param.Ids = [cameraId];

    const result = await this.cameraRequestService.postList(param);
    return result.Data;
  }
  async editStationCamera(item: Camera) {
    const result = await this.cameraRequestService.set(item);
    return !!result;
  }

  async delStationCamera(stationId: string, cameraId: string) {
    const result = await this.cameraRequestService.del(stationId, cameraId);
    return !!result;
  }
}
