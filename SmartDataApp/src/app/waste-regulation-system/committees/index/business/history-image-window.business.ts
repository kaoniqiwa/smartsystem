import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import { GalleryTarget } from "src/app/shared-module/gallery-target/gallery-target";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";

@Injectable()
export class HistoryImageWindowBussiness {
  constructor(private datePipe: DatePipe) {}
  Model?: GalleryTarget;

  Converter = new HistoryImageWindowConverter();
  load(record: IllegalDropEventRecord | MixedIntoEventRecord) {
    this.Model = this.Converter.Convert(record, this.datePipe);
  }
}

class HistoryImageWindowConverter
  implements
    ICommitteesConverter<
      IllegalDropEventRecord | MixedIntoEventRecord,
      GalleryTarget
    >
{
  Convert(input: IllegalDropEventRecord, datePipe: DatePipe): GalleryTarget {
    let output = new GalleryTarget(
      input.Id,
      input.Data.Objects[0].Confidence.toString(),
      ResourceMediumRequestService.getJPG(input.ImageUrl),
      input.Data.Objects,
      input.EventId,
      this.toDownLoadImgName(input, datePipe)
    );
    return output;
  }

  toDownLoadImgName(item: IllegalDropEventRecord, datePipe: DatePipe) {
    var name = "";
    name += item.ResourceName + " ";
    name += datePipe.transform(item.EventTime, "yyyy年MM月dd日 hh点mm分") + " ";
    for (const x of item.Data.Objects)
      for (const a of x.Polygon) {
        name += a.X + "," + a.Y + " ";
      }
    return name;
  }
}
