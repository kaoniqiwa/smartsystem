import {
  RecordRankEventTypes,
  RecordRankEventConverter,
} from "./record-rank-event.converter";

export class RecordRankEventBussiness {
  Converter = new RecordRankEventConverter();
  Types = new RecordRankEventTypes();
  Type = this.Types.IllegalDrop;
}
