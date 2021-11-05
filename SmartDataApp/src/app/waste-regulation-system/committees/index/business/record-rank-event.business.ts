import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  RecordRankEventTypes,
  RecordRankEventConverter,
} from "../../record-rank/event/record-rank-event.converter";

export class RecordRankEventBussiness {
  Converter = new RecordRankEventConverter();
  Types = new RecordRankEventTypes();
  Type = this.Types.IllegalDrop;

  onGarbageStationSelected: (
    sender: RecordRankEventBussiness,
    station: GarbageStation
  ) => void;

  OnTypeChanged(type: BussinessEnumItem) {
    this.Type = type;
  }

  OnGarbageStationSelected(station: GarbageStation) {
    if (this.onGarbageStationSelected) {
      this.onGarbageStationSelected(this, station);
    }
  }
}
