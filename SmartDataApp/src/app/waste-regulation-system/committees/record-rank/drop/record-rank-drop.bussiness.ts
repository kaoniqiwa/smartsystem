import { EventType } from "src/app/data-core/model/enum";
import {
  RecordRankDropTypes,
  RecordRankDropConverter,
} from "./record-rank-drop.converter";

export class RecordRankDropBussiness {
  Converter = new RecordRankDropConverter();
  Types = new RecordRankDropTypes();
  Type = this.Types.Timer;
}
