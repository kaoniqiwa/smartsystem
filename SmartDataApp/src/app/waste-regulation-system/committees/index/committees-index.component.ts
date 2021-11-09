import { Component, OnInit } from "@angular/core";

import { MQTTEventService } from "../../../common/tool/mqtt-event/mqtt-event.service";
import { EventPushService } from "../../../common/tool/mqtt-event/event-push.service";
import { Title } from "@angular/platform-browser";
import { SessionUser } from "../../../common/tool/session-user";
import { ConfigRequestService } from "../../../data-core/repuest/config.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { CommitteesIndexService } from "./committees-index.service";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { EventType } from "src/app/data-core/model/enum";
import { RecordRankEventBussiness } from "./business/record-rank-event.business";
import { RecordRankDropBussiness } from "./business/record-rank-drop.business";
import { CommitteesHistroyTableBussiness } from "./business/committees-history-table.business";
import { GalleryRollPageBusiness } from "./business/gallery-roll-page.business";
import { WindowViewModel } from "../window/window.model";
import { HistoryImageWindowBussiness } from "./business/history-image-window.business";
import { CommitteesStatisticBussiness } from "./business/committees-statistic.business";
import { WindowOperationBussiness } from "./business/window-operation.business";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { CommitteesToolbarBussiness } from "./business/committees-toolbar.bussiness";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-committees-index",
  templateUrl: "./committees-index.component.html",
  styleUrls: [
    "./committees-index.component.less",
    "./committees-index-toolbar.css",
  ],
  providers: [CommitteesIndexService, WindowOperationBussiness],
})
export class IndexCommitteesComponent implements OnInit {
  Committees?: Division;
  GarbageStations?: GarbageStation[];
  GarbageStationSelected?: GarbageStation;
  // cardSize: { width: number; height: number };

  userDivisionName_ = "";
  GlobalStoreService = GlobalStoreService;
  constructor(
    private datePipe: DatePipe,
    private indexService: CommitteesIndexService,

    private configService: ConfigRequestService,
    private eventPushService: EventPushService,
    private mqttSevice: MQTTEventService,
    private window: WindowOperationBussiness
  ) {
    this.mqttSevice.listenerIllegalDrop(GlobalStoreService.divisionId);
    this.eventPushService.pushIllegalDrop.subscribe((x) => {
      this.bussiness.toolbar.subscribe(x);
    });

    window.video.getPlaybackUrl = (begin, end, cameraId) => {
      return indexService.getVideoUrl(begin, end, cameraId);
    };
  }

  bussiness = {
    toolbar: new CommitteesToolbarBussiness(this.datePipe),
    historyTable: new CommitteesHistroyTableBussiness(this.window),
    statistic: new CommitteesStatisticBussiness(this.window),
    rank: {
      event: new RecordRankEventBussiness(this.window),
      drop: new RecordRankDropBussiness(this.window),
    },
    gallery: {
      rollPage: new GalleryRollPageBusiness(),
    },
  };

  async ngOnInit() {
    this.Committees = await this.indexService.getDivision(
      GlobalStoreService.divisionId
    );
    this.GarbageStations = await (
      await this.indexService.getGarbageStations(this.Committees.Id)
    ).Data;
    if (this.GarbageStations && this.GarbageStations.length > 0) {
      this.GarbageStationSelected = this.GarbageStations[0];

      this.bussiness.gallery.rollPage.load(this.GarbageStations);
    }
    GlobalStoreService.runInterval();
  }

  OnStationClicked(station: GarbageStation) {
    this.GarbageStationSelected = station;
    GlobalStoreService.change.emit(this.GarbageStationSelected);
  }

  OnCommitteesInfoClicked(division: Division) {
    this.window.summary.show = true;
  }
}
