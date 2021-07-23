import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { EventRecordUrl } from "../url/waste-regulation/event";
import { GetEventRecordsParams } from "../model/waste-regulation/illegal-drop-event-record";
import { GarbageFullEventRecord } from "../model/waste-regulation/garbage-full-event-record";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
@Injectable({
  providedIn: "root",
})
export class EventRequestService {
  constructor(private requestService: HowellAuthHttpService) {}

  async list(item: GetEventRecordsParams) {
    let response = await this.requestService
      .post<
        GetEventRecordsParams,
        HowellResponse<PagedList<GarbageFullEventRecord>>
      >(EventRecordUrl.garbageFullList(), item)
      .toPromise();
    return ServiceHelper.ResponseProcess(response, GarbageFullEventRecord);
  }
}
