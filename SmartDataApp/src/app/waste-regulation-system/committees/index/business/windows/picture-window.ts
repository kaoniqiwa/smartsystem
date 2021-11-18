import { DatePipe } from "@angular/common";
import { EventEmitter } from "@angular/core";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import { GalleryTarget } from "src/app/shared-module/gallery-target/gallery-target";
import { WindowViewModel } from "../../../window/window.model";

export class DetailsPictureWindowViewModel extends WindowViewModel {
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
