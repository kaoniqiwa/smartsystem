import { DatePipe } from "@angular/common";
import { Language } from "src/app/common/tool/language";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";

export class CommitteesToolbarBussiness {
  constructor(private datePipe: DatePipe) {}
  notify?: string;

  subscribe(record: IllegalDropEventRecord) {
    let date = this.datePipe.transform(record.EventTime, "HH:mm:ss");
    this.notify = `${date} ${record.Data.StationName} ${Language.EventType(
      record.EventType
    )}`;
  }
}
