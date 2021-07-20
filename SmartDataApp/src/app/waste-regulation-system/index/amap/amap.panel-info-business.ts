import { Injectable } from "@angular/core";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { AMapService } from "./amap.service";

@Injectable()
export class AMapPanelInfoBusiness {
  amap: AMapService;

  GarbageStation: GarbageStation;

  constructor() {}
}
