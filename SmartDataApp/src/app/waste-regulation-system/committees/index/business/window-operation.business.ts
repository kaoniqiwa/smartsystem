import { Injectable } from "@angular/core";
import { EventType, OnlineStatus } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { TableContentType } from "src/app/shared-module/business-component/station-view-summary/garbage-drop-event-history/garbage-drop-event-history.component";
import { GarbageStationSummaryViewPage } from "src/app/shared-module/business-component/station-view-summary/view-helper";
import { WindowViewModel } from "../../window/window.model";

@Injectable()
export class WindowOperationBussiness {
  constructor() {
    this.summary.show = true;
  }

  device = new DeviceWindowViewModel();
  record = new RecordWindowViewModel();
  station = new GarbageStationWindowViewModel();
  fullStation = new FullStationWindowViewModel();
  stranded = new StrandedWindowViewModel();
  summary = new SummaryWindowViewModel();
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
class SummaryWindowViewModel extends WindowViewModel {}
