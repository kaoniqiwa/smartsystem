import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import * as url from "../url/waste-regulation/event";
import { GetEventRecordsParams } from "../model/waste-regulation/illegal-drop-event-record";
import { GarbageFullEventRecord } from "../model/waste-regulation/garbage-full-event-record";
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

  async list(item: GetEventRecordsParams) {
    let response = await this.requestService
      .post<
        GetEventRecordsParams,
        HowellResponse<PagedList<GarbageFullEventRecord>>
      >(this.url.garbageFullList(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageFullEventRecord
    );
  }
}
