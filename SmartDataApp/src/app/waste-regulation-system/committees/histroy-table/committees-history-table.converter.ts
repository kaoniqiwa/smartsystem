import { DatePipe } from "@angular/common";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { ICommitteesConverter } from "../interface/committees-converter.interface";
import { CommitteesHistoryTableViewModel } from "./committees-history-table.model";

export class CommitteesHistoryTableConverter
  implements
    ICommitteesConverter<
      Array<IllegalDropEventRecord | MixedIntoEventRecord>,
      CommitteesHistoryTableViewModel<
        IllegalDropEventRecord | MixedIntoEventRecord
      >[]
    >
{
  Convert(
    input: Array<IllegalDropEventRecord | MixedIntoEventRecord>,
    datePipe: DatePipe
  ): CommitteesHistoryTableViewModel<
    IllegalDropEventRecord | MixedIntoEventRecord
  >[] {
    return input.map((x) => {
      return this.ConvertItem(x, datePipe);
    });
  }

  ConvertItem(
    input: IllegalDropEventRecord | MixedIntoEventRecord,
    datePipe: DatePipe
  ): CommitteesHistoryTableViewModel<
    IllegalDropEventRecord | MixedIntoEventRecord
  > {
    let vm = new CommitteesHistoryTableViewModel<
      IllegalDropEventRecord | MixedIntoEventRecord
    >();
    vm.Data = input;
    if (input instanceof IllegalDropEventRecord) {
      vm.Id = input.EventId;
      vm.StationName = input.Data.StationName;
      vm.Time = datePipe.transform(input.EventTime, "HH:mm");
    } else if (input instanceof MixedIntoEventRecord) {
      vm.Id = input.EventId;
      vm.Time = datePipe.transform(input.EventTime, "HH:mm");
    } else {
    }
    return vm;
  }
}
