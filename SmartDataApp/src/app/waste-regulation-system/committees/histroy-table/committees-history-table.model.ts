import { EventType } from "src/app/data-core/model/enum";

export class CommitteesHistoryTableViewModel<T> {
  Id: string;
  Index: number;
  StationName: string;
  Time: string;
  Data: T;
}

export class CommitteesHistoryTableTypes {
  IllegalDrop = EventType.IllegalDrop;
  MixedInto = EventType.MixedInto;
}
