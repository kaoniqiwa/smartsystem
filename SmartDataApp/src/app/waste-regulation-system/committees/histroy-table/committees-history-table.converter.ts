import { DatePipe } from "@angular/common";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { ICommitteesConverter } from "../interface/committees-converter.interface";
import { CommitteesHistoryTableViewModel } from "./committees-history-table.model";

export class CommitteesHistoryTableConverter
  implements
    ICommitteesConverter<
      Array<IllegalDropEventRecord | MixedIntoEventRecord>,
      CommitteesHistoryTableViewModel[]
    >
{
  Convert(
    input: IllegalDropEventRecord[] | MixedIntoEventRecord[],
    datePipe: DatePipe
  ): CommitteesHistoryTableViewModel[] {
    return input.map((x) => {
      return this.ConvertItem(x, datePipe);
    });
  }

  ConvertItem(
    input: IllegalDropEventRecord | MixedIntoEventRecord,
    datePipe: DatePipe
  ): CommitteesHistoryTableViewModel {
    let vm = new CommitteesHistoryTableViewModel();
    if (input instanceof IllegalDropEventRecord) {
      vm.Id = input.EventId;
      vm.StationName = input.ResourceName;
      vm.Time = datePipe.transform(input.EventTime, "HH:mm");
    } else if (input instanceof MixedIntoEventRecord) {
      vm.Id = input.EventId;
      vm.Time = datePipe.transform(input.EventTime, "HH:mm");
    } else {
    }
    return vm;
  }
}
