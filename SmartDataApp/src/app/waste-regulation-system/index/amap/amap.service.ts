import { Injectable } from "@angular/core";
import { Division } from "../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { MapListItem } from "./map-list-panel/map-list-item";

import { VideoPlayerService } from "./video-player.service";

@Injectable()
export class AMapService {
  constructor(public videoPlayerService: VideoPlayerService) {}
  focusToSelectContent = true;
  childrenOfList: Array<MapListItem<Division | GarbageStation>> = [];
}
