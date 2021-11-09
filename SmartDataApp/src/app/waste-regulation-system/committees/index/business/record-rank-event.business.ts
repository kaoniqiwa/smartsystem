import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  RecordRankEventTypes,
  RecordRankEventConverter,
} from "../../record-rank/event/record-rank-event.converter";
import { WindowOperationBussiness } from "./window-operation.business";

export class RecordRankEventBussiness {
  constructor(private window: WindowOperationBussiness) {}
  Converter = new RecordRankEventConverter();
  Types = new RecordRankEventTypes();
  Type = this.Types.IllegalDrop;

  OnTypeChanged(type: BussinessEnumItem) {
    this.Type = type;
  }

  OnGarbageStationSelected(station: GarbageStation) {
    this.window.garbageStation = station;
    this.window.record.show = true;
  }
}
