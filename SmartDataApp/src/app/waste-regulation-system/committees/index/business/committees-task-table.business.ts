import { GarbageStationSummaryViewPage } from "src/app/shared-module/business-component/station-view-summary/view-helper";
import { WindowOperationBussiness } from "./window-operation.business";

export class CommitteesTaskTableBussiness {
  constructor(private window: WindowOperationBussiness) {}

  onItemClicked(record: any) {
    console.log("onItemClicked", record);
    this.window.garbageStation = undefined;
    this.window.station.index = GarbageStationSummaryViewPage.event;
    this.window.station.show = true;
  }
}
