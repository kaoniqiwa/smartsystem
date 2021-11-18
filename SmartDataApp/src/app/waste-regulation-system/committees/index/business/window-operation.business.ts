import { DatePipe } from "@angular/common";
import { EventEmitter, Injectable } from "@angular/core";
import { CssSelectorList } from "@angular/core/src/render3";
import { SessionUser } from "src/app/common/tool/session-user";
import { EventType, OnlineStatus } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { TableContentType } from "src/app/shared-module/business-component/station-view-summary/garbage-drop-event-history/garbage-drop-event-history.component";
import { GarbageStationSummaryViewPage } from "src/app/shared-module/business-component/station-view-summary/view-helper";
import { MobileChangeStep } from "../../mobile/mobile.model";

import { WindowViewModel } from "../../window/window.model";

import { DetailsPictureWindowViewModel } from "./windows/picture-window";
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
  password = new ChangePasswordWindowViewModel();
  mobileChange = new ChangeMobileWindowViewModel();

  picture = new DetailsPictureWindowViewModel(this.datePipe);
  video = new VideoWindowViewModel();
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

class ChangePasswordWindowViewModel extends WindowViewModel {
  styles = {
    width: "576px",
    height: "400px",
    top: "50%",
    left: "50%",
    transform: "translate(-288px, -200px)",
  };

  closeable = true;

  onChanged() {
    this.closeable = false;
  }
  onCancel() {
    this.show = false;
  }
}
class ChangeMobileWindowViewModel extends WindowViewModel {
  constructor() {
    super();
    this.session = new SessionUser();
    let user = this.session.get();
    this.step = user.MobileNo ? MobileChangeStep.Check : MobileChangeStep.Bind;
  }
  session: SessionUser;
  styles = {
    width: "576px",
    height: "300px",
    top: "50%",
    left: "50%",
    transform: "translate(-288px, -150px)",
  };

  step: MobileChangeStep;

  bindedEvent = new EventEmitter();

  onBinded() {
    this.bindedEvent.emit();
    this.step = MobileChangeStep.Check;
    this.show = false;
  }
  onCancel() {
    this.show = false;
  }
}
