import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import * as url from "../url/event";
import { GetCameraAIEventRecordsParams } from "../model/aiop/camera-ai-event-records-params";
import { CameraAIEventRecord } from "../model/aiop/camera-ai-event-record";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { ServiceResponseProcessor } from "../model/waste-regulation/request-service-processor";
@Injectable({
  providedIn: "root",
})
export class EventRequestService {
  url: url.EventRecord;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.EventRecord();
  }

  async list(item: GetCameraAIEventRecordsParams) {
    let response = await this.requestService
      .post<
        GetCameraAIEventRecordsParams,
        HowellResponse<PagedList<CameraAIEventRecord>>
      >(this.url.list(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      CameraAIEventRecord
    );
  }
}
