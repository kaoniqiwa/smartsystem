import { Injectable } from "@angular/core";
import { PagedList } from "src/app/data-core/model/page";
import { HowellResponse } from "src/app/data-core/model/response";
import { HowellAuthHttpService } from "src/app/data-core/repuest/howell-auth-http.service";
import { AIOPResourceCameraUrl } from "src/app/data-core/url/aiop/resources";
import { Camera } from "../../../../data-core/model/aiop/camera.model";
import { CameraParams } from "../model/garbage-station-form.model";

@Injectable({
  providedIn: "root",
})
export class CameraRequestService {
  constructor(private requestService: HowellAuthHttpService) {}

  list(item: CameraParams) {
    return this.requestService
      .post<CameraParams, HowellResponse<PagedList<Camera>>>(
        AIOPResourceCameraUrl.list(),
        item
      )
      .toPromise();
  }
}
