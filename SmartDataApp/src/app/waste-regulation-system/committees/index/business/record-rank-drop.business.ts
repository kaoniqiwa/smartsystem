import { EventType } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  RecordRankDropTypes,
  RecordRankDropConverter,
} from "../../record-rank/drop/record-rank-drop.converter";

export class RecordRankDropBussiness {
  Converter = new RecordRankDropConverter();
  Types = new RecordRankDropTypes();
  Type = this.Types.Timer;

  onGarbageStationSelected: (
    bussiness: RecordRankDropBussiness,
    station: GarbageStation
  ) => void;

  OnGarbageStationSelected(station: GarbageStation) {
    EventType.MixedInto;
    if (this.onGarbageStationSelected) {
      this.onGarbageStationSelected(this, station);
    }
  }
}
