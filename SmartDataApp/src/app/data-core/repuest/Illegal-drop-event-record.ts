import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { GetEventRecordsParams } from "../model/waste-regulation/illegal-drop-event-record";
import { IllegalDropEventRecord } from "../model/waste-regulation/illegal-drop-event-record";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { ServiceResponseProcessor } from "../model/waste-regulation/request-service-processor";
import { EventRecordUrl } from "../url/waste-regulation/event";

@Injectable({
  providedIn: "root",
})
export class EventRequestService {
  constructor(private requestService: HowellAuthHttpService) {}

  async list(item: GetEventRecordsParams) {
    let response = await this.requestService
      .post<
        GetEventRecordsParams,
        HowellResponse<PagedList<IllegalDropEventRecord>>
      >(EventRecordUrl.illegalDrop(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      IllegalDropEventRecord
    );
  }
}
