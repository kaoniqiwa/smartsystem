import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import {
  GetGarbageDropEventRecordsParams,
  GarbageDropEventRecord,
} from "../model/waste-regulation/garbage-drop-event-record";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { ServiceResponseProcessor } from "../model/waste-regulation/request-service-processor";
import { EventRecordUrl } from "../url/waste-regulation/event";
@Injectable({
  providedIn: "root",
})
export class EventRequestService {
  constructor(private requestService: HowellAuthHttpService) {}

  async list(item: GetGarbageDropEventRecordsParams) {
    let response = await this.requestService
      .post<
        GetGarbageDropEventRecordsParams,
        HowellResponse<PagedList<GarbageDropEventRecord>>
      >(EventRecordUrl.garbageDropList(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageDropEventRecord
    );
  }
}
