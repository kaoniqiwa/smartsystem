import { Injectable } from "@angular/core";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { EventRecordUrl } from "../url/waste-regulation/event";
import { GetEventRecordsParams } from "../model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "../model/waste-regulation/mixed-into-event-record";
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
        HowellResponse<PagedList<MixedIntoEventRecord>>
      >(EventRecordUrl.mixedIntoList(), item)
      .toPromise();
    return ServiceHelper.ResponseProcess(response, MixedIntoEventRecord);
  }
}
