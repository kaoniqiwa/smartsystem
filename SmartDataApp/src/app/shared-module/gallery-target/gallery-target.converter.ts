import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";

import { GalleryTarget } from "./gallery-target";

type Record = IllegalDropEventRecord | MixedIntoEventRecord;

@Injectable()
export class GalleryTargetConverter {
  constructor(private datePipe: DatePipe) {}
  Convert(record: Record): GalleryTarget {
    let target = new GalleryTarget(
      record.Data.Objects[0].Id,
      record.Data.Objects[0].Confidence.toString(),
      ResourceMediumRequestService.getJPG(record.ImageUrl),
      record.Data.Objects,
      record.EventId,
      this.toDownLoadImgName(record),
      record.Data.Rules
    );
    return target;
  }

  toDownLoadImgName(item: Record) {
    var name = "";
    name += item.ResourceName + " ";
    name +=
      this.datePipe.transform(item.EventTime, "yyyy年MM月dd日 hh点mm分") + " ";
    for (const x of item.Data.Objects)
      for (const a of x.Polygon) {
        name += a.X + "," + a.Y + " ";
      }
    return name;
  }
}
