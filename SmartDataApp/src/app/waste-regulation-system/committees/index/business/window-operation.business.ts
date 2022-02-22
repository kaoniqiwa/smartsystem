import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { EventType, OnlineStatus } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { TableContentType } from "src/app/shared-module/business-component/station-view-summary/garbage-drop-event-history/garbage-drop-event-history.component";
import { GarbageStationSummaryViewPage } from "src/app/shared-module/business-component/station-view-summary/view-helper";

import { WindowViewModel } from "../../window/window.model";
import { MobileWindowViewModel } from "./windows/mobile-window";
import { PasswordWindowViewModel } from "./windows/password-window";

import { DetailsPictureWindowViewModel } from "./windows/picture-window";
import { PlaybackConfigWindowViewModel } from "./windows/playback-config-window";
import { VideoWindowViewModel } from "./windows/video-window";

@Injectable()
export class WindowOperationBussiness {
  constructor(private datePipe: DatePipe) {
    this.picture.playVideoEvent.subscribe((record) => {
      this.video.load(record);
      this.video.show = true;
    });
  }

  device = new DeviceWindowViewModel();
  record = new RecordWindowViewModel();
  station = new GarbageStationWindowViewModel();
  fullStation = new FullStationWindowViewModel();
  stranded = new StrandedWindowViewModel();
  summary = new SummaryWindowViewModel();
  password = new PasswordWindowViewModel();
  mobile = new MobileWindowViewModel();

  picture = new DetailsPictureWindowViewModel(this.datePipe);
  video = new VideoWindowViewModel();

  playback = new PlaybackConfigWindowViewModel();

  garbageStation?: GarbageStation;
}

class DeviceWindowViewModel extends WindowViewModel {
  onlineStatus?: OnlineStatus;
}
class RecordWindowViewModel extends WindowViewModel {
  eventType?: EventType = EventType.IllegalDrop;
}
class GarbageStationWindowViewModel extends WindowViewModel {
  index = GarbageStationSummaryViewPage.info;

  contentType: TableContentType = TableContentType.event;
  garbageDropHandle?: boolean;
  garbageDropTimeout?: boolean;
}
class FullStationWindowViewModel extends WindowViewModel {}
class StrandedWindowViewModel extends WindowViewModel {}
class SummaryWindowViewModel extends WindowViewModel {
  style = {
    height: "89%",
    top: "55%",
  };
}
