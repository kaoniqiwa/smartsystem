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
import { RecordRankEventBussiness } from "../record-rank/event/record-rank-event.bussiness";
import { RecordRankDropBussiness } from "../record-rank/drop/record-rank-drop.bussiness";
import { CommitteesHistroyTableBussiness } from "../histroy-table/committees-history-table.business";

@Component({
  selector: "app-committees-index",
  templateUrl: "./committees-index.component.html",
  styleUrls: [
    "./committees-index.component.less",
    "./committees-index-toolbar.css",
  ],
  providers: [CommitteesIndexService],
})
export class IndexCommitteesComponent implements OnInit {
  Committees?: Division;
  GarbageStations?: GarbageStation[];
  GarbageStationSelected?: GarbageStation;
  cardSize: { width: number; height: number };

  userDivisionName_ = "";
  GlobalStoreService = GlobalStoreService;
  constructor(
    private indexService: CommitteesIndexService,

    private configService: ConfigRequestService,
    private eventPushService: EventPushService,
    private mqttSevice: MQTTEventService
  ) {}

  RecordRankEventBussiness = new RecordRankEventBussiness();
  RecordRankDropBussiness = new RecordRankDropBussiness();
  CommitteesHistroyTableBussiness = new CommitteesHistroyTableBussiness();

  async ngOnInit() {
    this.Committees = await this.indexService.getDivision(
      GlobalStoreService.divisionId
    );
    this.GarbageStations = await (
      await this.indexService.getGarbageStations(this.Committees.Id)
    ).Data;
    if (this.GarbageStations && this.GarbageStations.length > 0) {
      this.GarbageStationSelected = this.GarbageStations[0];
    }
    GlobalStoreService.runInterval();
  }

  OnStationClicked(station: GarbageStation) {
    this.GarbageStationSelected = station;
  }
}
