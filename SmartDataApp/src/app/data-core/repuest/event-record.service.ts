import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { GetCameraAIEventRecordsParams } from "../model/aiop/camera-ai-event-records-params";
import { CameraAIEventRecord } from "../model/aiop/camera-ai-event-record";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
import { EventRecordUrl } from "../url/event";
@Injectable({
  providedIn: "root",
})
export class EventRequestService {
  constructor(private requestService: HowellAuthHttpService) {}

  async list(item: GetCameraAIEventRecordsParams) {
    let response = await this.requestService
      .post<
        GetCameraAIEventRecordsParams,
        HowellResponse<PagedList<CameraAIEventRecord>>
      >(EventRecordUrl.list(), item)
      .toPromise();
    return ServiceHelper.ResponseProcess(response, CameraAIEventRecord);
  }
}
