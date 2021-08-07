import { Injectable } from "@angular/core";
import { Camera } from "../model/aiop/camera.model";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { CameraParams } from "../params/camera.params";
import { AIOPResourceCameraUrl } from "../url/aiop/resources";
import { HowellAuthHttpService } from "./howell-auth-http.service";

@Injectable({
  providedIn: "root",
})
export class RequestCameraService {
  constructor(private httpService: HowellAuthHttpService) {}

  list(item: CameraParams) {
    let res = this.httpService
      .post<CameraParams, HowellResponse<PagedList<Camera>>>(
        AIOPResourceCameraUrl.list(),
        item
      )
      .toPromise();
    return res;
  }
}
