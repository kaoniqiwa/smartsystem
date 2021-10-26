import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { Language } from "src/app/common/tool/language";
import { TheDayTime } from "src/app/common/tool/tool.service";
import { PagedList } from "src/app/data-core/model/page";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import {
  GarbageDropEventRecord,
  GetGarbageDropEventRecordsParams,
} from "src/app/data-core/model/waste-regulation/garbage-drop-event-record";
import { GarbageDropEventRequestService } from "src/app/data-core/repuest/garbage-drop-event-record";
import { ICommitteesService } from "../interface/committees-service.interface";

import { TaskTableViewModel } from "./task-table.model";

@Injectable()
export class TaskTableService
  implements ICommitteesService<PagedList<GarbageDropEventRecord>>
{
  constructor(private eventService: GarbageDropEventRequestService) {}

  load(divisionId: string) {
    let params = new GetGarbageDropEventRecordsParams();

    let day = TheDayTime(new Date());

    params.BeginTime = day.begin;
    params.EndTime = day.end;
    params.DivisionIds = [divisionId];
    return this.eventService.list(params);
  }
}
