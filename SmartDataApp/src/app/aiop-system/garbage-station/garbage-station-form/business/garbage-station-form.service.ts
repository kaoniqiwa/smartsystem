import { Injectable } from "@angular/core";
import {
  GarbageStationRequestService,
  GarbageStationTypeRequestService,
} from "src/app/data-core/repuest/garbage-station.service";
import {
  AiopCameraRequestService,
  EncodeDeviceRequestService,
} from "src/app/data-core/repuest/resources.service";

import { GarbageStationCameraRequestService } from "src/app/data-core/repuest/garbage-station.service";
import {
  GetCamerasParams,
  GetEncodeDevicesParams,
} from "src/app/data-core/model/aiop/encode-devices-params";
import {
  ListAttribute,
  TableAttribute,
} from "src/app/common/tool/table-form-helper";
import {
  Camera,
  GetGarbageStationCamerasParams,
} from "src/app/data-core/model/waste-regulation/camera";

@Injectable()
export class GarbageStationFormService {
  constructor(
    private _garbageStationTypeService: GarbageStationTypeRequestService, // 厢房类型
    private _aiopCameraService: AiopCameraRequestService, // aiop摄像机
    private _stationCameraService: GarbageStationCameraRequestService, // 厢房摄像机
    private _garbageStationService: GarbageStationRequestService, // 垃圾厢房
    private _encodeDeviceService: EncodeDeviceRequestService // aiop编码设备
  ) {}

  /**
   * 厢房类型列表
   *  @returns GarbageStationType[]
   */
  async listGarbageStationTypes() {
    let stationTypes = await this._garbageStationTypeService.list();
    return stationTypes;
  }
  /**
   *
   * 获取编码设备列表
   * @returns EncodeDevice[]
   */
  async listEncodeDevices() {
    const param = new GetEncodeDevicesParams();
    param.PageIndex = 1;
    param.PageSize = new ListAttribute().maxSize;
    let res = await this._encodeDeviceService.list(param).toPromise();
    return res.Data.Data;
  }

  /**
   * @param pageIndex number
   * @param searchText string
   * @returns PagedList<AiopCamera>
   */
  async listAiopCamers(pageIndex: number, searchText: string) {
    let stationCameras = await this._listStationCameras();
    let aiopData = await await this._listAiopCameras(pageIndex, searchText);
    let aiopCameras = aiopData.Data.Data;

    console.log("垃圾厢房摄像机", stationCameras);
    console.log("aiop摄像机", aiopCameras);

    // 寻找不在 stationCameras 中元素
    let arr = aiopCameras.filter((aiopCamera) => {
      return !stationCameras.some((stationCamera) => {
        return stationCamera.Id == aiopCamera.Id;
      });
    });

    console.log("去重后的aiop摄像机", arr);

    aiopData.Data.Data = arr;

    return aiopData;
  }

  /**
   * 根据厢房id获取厢房信息
   * @param garbageStationId
   * @returns
   */
  async getGarbageStation(garbageStationId: string) {
    let res = this._garbageStationService.get(garbageStationId);
    return res;
  }
  /**
   *  根据厢房id，获取厢房下摄像机列表
   * @param garbageStationId
   * @returns
   */
  async listStationCameras(garbageStationId: string, searchText: string) {
    let result = await this._stationCameraService.list(garbageStationId);
    result = result.filter((camera) => camera.Name.includes(searchText));
    return result;
  }
  /**
   *  删除垃圾厢房下的摄像机
   * @param garbageStationId
   * @param cameraId
   * @returns
   */
  async deleteStationCamera(garbageStationId: string, cameraId: string) {
    let res = await this._stationCameraService.del(garbageStationId, cameraId);
    return res;
  }
  /**
   * 给垃圾厢房添加摄像机
   * @param camera
   * @returns
   */
  async addCameraToGarbageStation(camera: Camera) {
    const result = await this._stationCameraService.create(camera);
    return result;
  }

  /**
   * 获取所有aiop摄像机列表
   * @param pageIndex
   * @param searchText
   * @returns PagedList<AiopCamera>
   */
  private async _listAiopCameras(pageIndex: number, searchText: string) {
    const response = await this._aiopCameraService
      .list(this._getRequsetParam(pageIndex, searchText))
      .toPromise();

    return response;
  }
  /**
   *  获取所有垃圾厢房摄像机列表
   * @returns Camera[]
   */
  private async _listStationCameras() {
    const param = new GetGarbageStationCamerasParams();
    param.PageIndex = 1;
    param.PageSize = 999;
    const response = await this._stationCameraService.postList(param);
    const res = response.Data;

    return res;
  }

  private _getRequsetParam(pageIndex: number, searchText: string) {
    let param = new GetCamerasParams();
    param.PageIndex = pageIndex;
    param.PageSize = 999;
    param.RegionIdNullable = true;
    param.Name = searchText;
    return param;
  }
}
