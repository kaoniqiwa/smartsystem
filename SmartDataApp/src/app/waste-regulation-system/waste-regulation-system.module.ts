import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared-module/shared.module";
import {
  WasteRegulationCommitteesSystemRoutingModule,
  WasteRegulationSystemRoutingModule,
} from "./waste-regulation-system-routing.module";
import { IndexComponent } from "./index/index.component";
import { AMapComponent } from "./index/amap/amap.component";
import { VideoWindowComponent } from "../video-window/video-window.component";
import { MapListPanelComponent } from "./index/amap/map-list-panel/map-list-panel.component";
import { PointInfoPanelComponent } from "./index/amap/point-info-panel/point-info-panel.component";
import { IndexCommitteesComponent } from "./index/index.component-committees";

@NgModule({
  declarations: [
    IndexComponent,
    AMapComponent,
    VideoWindowComponent,
    MapListPanelComponent,
    PointInfoPanelComponent,
  ],
  imports: [CommonModule, SharedModule, WasteRegulationSystemRoutingModule],
})
export class WasteRegulationSystemModule {}

@NgModule({
  declarations: [
    IndexCommitteesComponent,
    AMapComponent,
    VideoWindowComponent,
    MapListPanelComponent,
    PointInfoPanelComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    WasteRegulationCommitteesSystemRoutingModule,
  ],
})
export class WasteRegulationCommitteesSystemModule {}
