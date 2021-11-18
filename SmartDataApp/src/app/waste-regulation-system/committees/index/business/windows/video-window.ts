import { PlayVideo } from "src/app/aiop-system/common/play-video";
import { SessionUser } from "src/app/common/tool/session-user";
import { DateInterval } from "src/app/common/tool/tool.service";
import { VideoUrl } from "src/app/data-core/model/aiop/video-url";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { WindowViewModel } from "../../../window/window.model";

export class VideoWindowViewModel extends WindowViewModel {
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
