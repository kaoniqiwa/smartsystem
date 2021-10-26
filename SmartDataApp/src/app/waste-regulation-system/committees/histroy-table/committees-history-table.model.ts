import { EventType } from "src/app/data-core/model/enum";

export class CommitteesHistoryTableViewModel {
  Id: string;
  Index: number;
  StationName: string;
  Time: string;
  PlayVideo: () => void;
  ShowPicture: () => void;
}

export class CommitteesHistoryTableTypes {
  IllegalDrop = EventType.IllegalDrop;
  MixedInto = EventType.MixedInto;
}
