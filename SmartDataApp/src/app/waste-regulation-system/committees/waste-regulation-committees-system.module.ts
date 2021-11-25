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
import { ToolbarComponent } from "./toolbar/committees-toolbar.component";
import { CommitteesStatisticComponent } from "./statistic/committees-statistic.component";
import { TaskTableComponent } from "./task-table/task-table.component";
import { RecordRankComponent } from "./record-rank/record-rank.component";
import { CommitteesHistroyTableComponent } from "./histroy-table/committees-history-table.component";
import { WindowComponent } from "./window/window.component";
import { StatisticSummaryComponent } from "./summary/statistic-summary.component";
import { StatisticSummaryHeaderComponent } from "./summary/header/statistic-summary-header.component";
import { StatisticSummaryChartsComponent } from "./summary/charts/statistic-summary-charts.component";
import { StatisticSummaryEventRatioChartComponent } from "./summary/charts/event-ratio/statistic-summary-event-ratio-chart.component";
import { StatisticSummaryIllegalDropChartComponent } from "./summary/charts/line-chart/statistic-summary-line-chart.component";
import { StatisticSummaryStationEventChartComponent } from "./summary/charts/station-event/statistic-summary-station-event-chart.component";
import { StatisticSummaryTaskChartComponent } from "./summary/charts/task-statistic/statistic-summary-task-chart.component";
import { MobileBindingComponent } from "./mobile/mobile-binding/mobile-binding.component";
import { MatSliderModule } from "@angular/material";
import { PasswordChangeComponent } from "./password-change/password-change.component";
import { MobileViewComponent } from "./mobile/mobile-change/view/mobile-view.component";
import { MobileChangeComponent } from "./mobile/mobile-change/mobile-change.component";
import { PlaybackConfigComponent } from './playback-config/playback-config.component';

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

    WindowComponent,

    StatisticSummaryComponent,

    StatisticSummaryHeaderComponent,

    StatisticSummaryChartsComponent,

    StatisticSummaryEventRatioChartComponent,

    StatisticSummaryIllegalDropChartComponent,

    StatisticSummaryStationEventChartComponent,

    StatisticSummaryTaskChartComponent,

    MobileBindingComponent,

    MobileChangeComponent,

    PasswordChangeComponent,

    MobileViewComponent,

    PlaybackConfigComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    WasteRegulationCommitteesSystemRoutingModule,
  ],
})
export class WasteRegulationCommitteesSystemModule {}
