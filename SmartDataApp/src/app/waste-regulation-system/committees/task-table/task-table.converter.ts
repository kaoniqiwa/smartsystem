import { DatePipe } from "@angular/common";
import { Language } from "src/app/common/tool/language";
import { GarbageDropEventRecord } from "src/app/data-core/model/waste-regulation/garbage-drop-event-record";
import { TaskTableViewModel } from "./task-table.model";
import { ICommitteesConverter } from "../interface/committees-converter.interface";

export class TaskTableConverter
  implements
    ICommitteesConverter<GarbageDropEventRecord[], TaskTableViewModel[]>
{
  Convert(records: GarbageDropEventRecord[], datePipe: DatePipe) {
    let datas = new Array<TaskTableViewModel>();

    let i = 0;
    datas = records
      .sort((a, b) => {
        return (
          new Date(b.Data.DropTime).getTime() -
          new Date(a.Data.DropTime).getTime()
        );
      })
      .map((x) => {
        return this.itemConvert(++i, x, datePipe);
      });
    return datas;
  }

  private itemConvert(
    index: number,
    record: GarbageDropEventRecord,
    datePipe: DatePipe
  ) {
    let vm = new TaskTableViewModel();
    vm.StationName = record.Data.StationName;
    vm.Processor = record.Data.ProcessorName;
    vm.Id = record.EventId;
    vm.Index = index;

    let current = record.Data.IsHandle
      ? new Date(record.Data.HandleTime)
      : new Date();
    let drop = new Date(record.Data.DropTime);
    let interval_time = current.getTime() - drop.getTime();
    let interval = new Date(interval_time);
    interval.setHours(interval.getHours() + interval.getTimezoneOffset() / 60);
    vm.Interval = Language.Time(interval);
    vm.Time = datePipe.transform(record.Data.DropTime, "HH:mm");
    vm.State = record.EventType;
    vm.StateLanguage = Language.GarbageDropEventType(
      record.EventType,
      record.Data.IsTimeout
    );
    return vm;
  }
}
