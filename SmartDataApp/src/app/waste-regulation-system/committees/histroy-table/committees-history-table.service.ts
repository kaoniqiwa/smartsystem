import { Injectable } from "@angular/core";
import { TheDayTime } from "src/app/common/tool/tool.service";
import { EventType, TimeUnit } from "src/app/data-core/model/enum";
import {
  GetEventRecordsParams,
  IllegalDropEventRecord,
} from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";

import { IllegalDropEventRequestService } from "src/app/data-core/repuest/Illegal-drop-event-record";
import { MixedIntoEventRequestService } from "src/app/data-core/repuest/mixed-into-event-record";
import { ICommitteesService } from "../interface/committees-service.interface";

@Injectable()
export class CommitteesHistroyTableService
  implements
    ICommitteesService<Array<IllegalDropEventRecord | MixedIntoEventRecord>>
{
  constructor(
    private mixedIntoService: MixedIntoEventRequestService,
    private illegalDropService: IllegalDropEventRequestService
  ) {}

  async load(
    divisionId: string,
    eventType: EventType
  ): Promise<Array<IllegalDropEventRecord | MixedIntoEventRecord>> {
    let day = TheDayTime(new Date());
    let params = new GetEventRecordsParams();
    params.PageSize = 999;
    params.BeginTime = day.begin;
    params.EndTime = day.end;
    params.DivisionIds = [divisionId];

    let service = this.getService(eventType);
    let paged = await service.list(params);
    return paged.Data;
  }

  getService(eventType: EventType) {
    switch (eventType) {
      case EventType.IllegalDrop:
        return this.illegalDropService;
      case EventType.MixedInto:
        return this.mixedIntoService;
      default:
        break;
    }
  }
}
