import {
  GetGarbageStationCamerasParams,
  Camera,
} from "../model/waste-regulation/camera";
import { CameraRequestService } from "../repuest/garbage-station.service";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { AppCaChe } from "../../common/tool/app-cache/app-cache";
import { Injectable } from "@angular/core";
@Injectable()
export class GarbageStationCameraDao extends ListAttribute {
  cache = new AppCaChe(60 * 30 * 1000);
  readonly camera = "Camera";

  constructor(private requestService: CameraRequestService) {
    super();
  }

  async garbageStationCameras() {
    var result = this.cache.get<Camera[]>(this.camera);
    if (!result) {
      const param = new GetGarbageStationCamerasParams();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      const response = await this.requestService.postList(param);
      this.cache.set(this.camera, response.Data);
      result = response.Data;
    }
    return result;
  }
}
