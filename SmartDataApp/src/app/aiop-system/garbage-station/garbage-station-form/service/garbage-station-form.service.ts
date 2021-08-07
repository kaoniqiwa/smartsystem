import { Injectable } from "@angular/core";
import {
  GarbageStationRequestService,
  GarbageStationTypeRequestService,
} from "src/app/data-core/repuest/garbage-station.service";
import { RequestEncodeDeviceService } from "../../../../data-core/repuest/encoded-device.service";
import { EncodedDeviceParams } from "src/app/data-core/params/encoded-device.params";
import { CameraParams } from "src/app/data-core/params/camera.params";
import { RequestCameraService } from "src/app/data-core/repuest/camera.service";

@Injectable()
export class GarbageStationFormService {
  constructor(
    private _garbageStationTypeService: GarbageStationTypeRequestService,
    private _cameraService: RequestCameraService,
    private _garbageStationService: GarbageStationRequestService,
    private _encodeDeviceService: RequestEncodeDeviceService
  ) {}

  // 厢房类型列表
  async listGarbageStationTypes() {
    let stationTypes = await this._garbageStationTypeService.list();
    return stationTypes;
  }
  // 未绑定摄像机列表
  async listCamers(params: CameraParams) {
    let res = await this._cameraService.list(params);
    return res;
  }

  // 获取编码设备列表
  async listEncodeDevices(params: EncodedDeviceParams) {
    let res = await this._encodeDeviceService.list(params);
    return res.Data.Data;
  }
  async getGa() {
    let garbage = await this._garbageStationService.get("310105001001");
    console.log("garbage");
  }
}
