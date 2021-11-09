import { DatePipe } from "@angular/common";
import { EventEmitter, Injectable } from "@angular/core";
import { PlayVideo } from "src/app/aiop-system/common/play-video";
import { SessionUser } from "src/app/common/tool/session-user";
import { DateInterval } from "src/app/common/tool/tool.service";
import { CameraAIEventRecord } from "src/app/data-core/model/aiop/camera-ai-event-record";
import {
  GetVodUrlParams,
  VideoUrl,
} from "src/app/data-core/model/aiop/video-url";
import { EventType, OnlineStatus } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import {
  ResourceMediumRequestService,
  StationResourceSRServersRequestService,
} from "src/app/data-core/repuest/resources.service";
import { TableContentType } from "src/app/shared-module/business-component/station-view-summary/garbage-drop-event-history/garbage-drop-event-history.component";
import { GarbageStationSummaryViewPage } from "src/app/shared-module/business-component/station-view-summary/view-helper";
import { GalleryTarget } from "src/app/shared-module/gallery-target/gallery-target";
import { WindowViewModel } from "../../window/window.model";
import { CommitteesIndexService } from "../committees-index.service";

@Injectable()
export class WindowOperationBussiness {
  constructor(private datePipe: DatePipe) {
    this.picture.playVideoEvent.subscribe(
      (record: IllegalDropEventRecord | MixedIntoEventRecord) => {
        this.video.load(record);
        this.video.show = true;
      }
    );
  }

  device = new DeviceWindowViewModel();
  record = new RecordWindowViewModel();
  station = new GarbageStationWindowViewModel();
  fullStation = new FullStationWindowViewModel();
  stranded = new StrandedWindowViewModel();
  summary = new SummaryWindowViewModel();

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
class DetailsPictureWindowViewModel extends WindowViewModel {
  constructor(private datePipe: DatePipe) {
    super();
  }

  close: () => void = () => {
    this.show = false;
  };
  target: GalleryTarget<IllegalDropEventRecord | MixedIntoEventRecord>;

  load(record: IllegalDropEventRecord | MixedIntoEventRecord) {
    this.target = new GalleryTarget(
      record.Id,
      record.Data.Objects[0].Confidence.toString(),
      ResourceMediumRequestService.getJPG(record.ImageUrl),
      record.Data.Objects,
      record.EventId,
      this.toDownLoadImgName(record, this.datePipe)
    );
    this.target.data = record;
  }

  toDownLoadImgName(
    item: IllegalDropEventRecord | MixedIntoEventRecord,
    datePipe: DatePipe
  ) {
    let date = datePipe.transform(item.EventTime, "yyyy年MM月dd日 hh点mm分");
    var name = `${item.ResourceName} ${date} `;
    name += item.ResourceName + " ";
    for (const x of item.Data.Objects)
      for (const a of x.Polygon) {
        name += a.X + "," + a.Y + " ";
      }
    return name;
  }

  playVideoEvent: EventEmitter<IllegalDropEventRecord | MixedIntoEventRecord> =
    new EventEmitter();

  playVideo = async (id: string) => {
    if (id === this.target.data.EventId) {
      let event = this.target.data;
      this.playVideoEvent.emit(event);
    }
    // this.navService.playVideoBug.emit(true);
  };
}

class VideoWindowViewModel extends WindowViewModel {
  player: PlayVideo;

  getPlaybackUrl: (
    begin: Date,
    end: Date,
    cameraId: string
  ) => Promise<VideoUrl>;

  load(record: IllegalDropEventRecord | MixedIntoEventRecord) {
    const user = new SessionUser();
    let begin = DateInterval(
      record.EventTime.toString(),
      user.video.beforeInterval
    );
    let end = DateInterval(
      record.EventTime.toString(),
      user.video.afterInterval
    );
    const promise = this.getPlaybackUrl(begin, end, record.ResourceId);
    promise.then((url) => {
      this.play(url, record.ResourceName);
    });
  }

  play(url: VideoUrl, name: string) {
    this.player = new PlayVideo(url.WebUrl, null, name);
    this.player.url = url.Url;
  }

  close = () => {
    this.player = undefined;
    this.show = false;
  };
}
