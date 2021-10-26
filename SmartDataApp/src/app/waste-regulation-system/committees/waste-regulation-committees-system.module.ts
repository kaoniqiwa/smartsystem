import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared-module/shared.module";
import { WasteRegulationCommitteesSystemRoutingModule } from "./waste-regulation-committees-system-routing.module";

import { AMapComponent } from "../index/amap/amap.component";
import { VideoWindowComponent } from "../../video-window/video-window.component";
import { MapListPanelComponent } from "../index/amap/map-list-panel/map-list-panel.component";
import { PointInfoPanelComponent } from "../index/amap/point-info-panel/point-info-panel.component";
import { IndexCommitteesComponent } from "./index/committees-index.component";
import { CommitteesNavicationComponent } from "./navication/committees-navication.component";
import { DivisionInformationComponent } from "./station-information/station-information.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { CommitteesStatisticComponent } from "./statistic/committees-statistic.component";
import { TaskTableComponent } from "./task-table/task-table.component";
import { RecordRankComponent } from "./record-rank/record-rank.component";
import { CommitteesHistroyTableComponent } from "./histroy-table/committees-history-table.component";

@NgModule({
  declarations: [
    IndexCommitteesComponent,
    AMapComponent,
    VideoWindowComponent,
    MapListPanelComponent,
    PointInfoPanelComponent,

    CommitteesNavicationComponent,

    DivisionInformationComponent,

    ToolbarComponent,

    CommitteesStatisticComponent,

    TaskTableComponent,

    RecordRankComponent,

    CommitteesHistroyTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    WasteRegulationCommitteesSystemRoutingModule,
  ],
})
export class WasteRegulationCommitteesSystemModule {}
