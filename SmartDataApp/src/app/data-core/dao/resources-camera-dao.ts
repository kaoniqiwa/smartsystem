import { CameraRequestService } from "../../data-core/repuest/garbage-station.service";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { AppCaChe } from "../../common/tool/app-cache/app-cache";
import { GetGarbageStationCamerasParams } from "../model/waste-regulation/camera";
import { Camera } from "../model/waste-regulation/camera";

export class ResourceCameraDao extends ListAttribute {
  cache = new AppCaChe(60 * 10 * 1000);
  readonly resourceCameras = "ResourceCameras";
  constructor(private requestService: CameraRequestService) {
    super();
  }

  async allResourceCameras() {
    var result = this.cache.get<Camera[]>(this.resourceCameras);
    if (!result) {
      const param = new GetGarbageStationCamerasParams();
      param.PageIndex = 1;
      param.PageSize = this.maxSize;
      const response = await this.requestService.postList(param);
      this.cache.set(this.resourceCameras, response.Data);
      result = response.Data;
    }
    return result;
  }
}
