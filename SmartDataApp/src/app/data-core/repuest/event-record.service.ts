import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import * as url from "../url/event";
import { GetCameraAIEventRecordsParams } from "../model/aiop/camera-ai-event-records-params";
import { CameraAIEventRecord } from "../model/aiop/camera-ai-event-record";
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
  providedIn: "root",
})
export class EventRequestService {
  url: url.EventRecord;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.EventRecord();
  }

  list(item: GetCameraAIEventRecordsParams) {
    return this.requestService.post<
      GetCameraAIEventRecordsParams,
      HowellResponse<PagedList<CameraAIEventRecord>>
    >(this.url.list(), item);
  }
}
