import { Injectable } from "@angular/core";
import { GarbageStationCamera } from "../model/aiop/garbage-station-camera.model";
import { GarbageStation } from "../model/aiop/garbage-station.model";
import { HowellResponse } from "../model/response";
import {
  CameraUrl,
  GarbageStationsUrl,
} from "../url/waste-regulation/garbage-station";
import { HowellAuthHttpService } from "./howell-auth-http.service";

/**
 *  垃圾厢房请求服务
 */
@Injectable({
  providedIn: "root",
})
export class RequestGarbageStationsService {
  constructor(private httpService: HowellAuthHttpService) {}
  // 创建垃圾厢房
  async create(item: GarbageStation) {
    let res = await this.httpService
      .post<GarbageStation, HowellResponse<GarbageStation>>(
        GarbageStationsUrl.create(),
        item
      )
      .toPromise();
    return res;
  }

  async delete(id: string) {
    let res = await this.httpService
      .delete<GarbageStation>(GarbageStationsUrl.del(id))
      .toPromise();
    return res;
  }

  // 添加摄像机
  async addCamera(camera: GarbageStationCamera) {
    let res = await this.httpService
      .post<GarbageStationCamera, HowellResponse<GarbageStationCamera>>(
        CameraUrl.create(camera.GarbageStationId),
        camera
      )
      .toPromise();

    return res;
  }
}
