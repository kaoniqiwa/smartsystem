import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import * as url from "../url/waste-regulation/event";
import {
  GetGarbageDropEventRecordsParams,
  GarbageDropEventRecord,
} from "../model/waste-regulation/garbage-drop-event-record";
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

  async list(item: GetGarbageDropEventRecordsParams) {
    let response = await this.requestService
      .post<
        GetGarbageDropEventRecordsParams,
        HowellResponse<PagedList<GarbageDropEventRecord>>
      >(this.url.garbageDropList(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageDropEventRecord
    );
  }
}
