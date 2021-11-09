import { EventType } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  RecordRankDropTypes,
  RecordRankDropConverter,
} from "../../record-rank/drop/record-rank-drop.converter";
import { WindowOperationBussiness } from "./window-operation.business";

export class RecordRankDropBussiness {
  constructor(private window: WindowOperationBussiness) {}
  Converter = new RecordRankDropConverter();
  Types = new RecordRankDropTypes();
  Type = this.Types.Timer;

  OnGarbageStationSelected(station: GarbageStation) {
    EventType.MixedInto;
    this.window.garbageStation = station;

    this.window.stranded.show = true;
  }
}
