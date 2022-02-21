import { DatePipe } from "@angular/common";
import { ResourceMediumRequestService } from "../../../data-core/repuest/resources.service";
import { IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";

import {
  GalleryTarget,
  ImageEventEnum,
} from "../../gallery-target/gallery-target";
import { GalleryTargetConverter } from "../../gallery-target/gallery-target.converter";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";

export class GalleryTargetView {
  galleryTarget: GalleryTarget;
  galleryTargetBox = false;

  refreshImg: {
    state: boolean;
  };

  constructor(public datePipe: DatePipe) {
    this.refreshImg = {
      state: true,
    };
  }

  private _converter?: GalleryTargetConverter;
  public get converter(): GalleryTargetConverter {
    if (!this._converter) {
      this._converter = new GalleryTargetConverter(this.datePipe);
    }
    return this._converter;
  }

  neighborEventFn: (
    id: string,
    e: ImageEventEnum
  ) => {
    prev: boolean;
    next: boolean;
    item: IllegalDropEventRecord | MixedIntoEventRecord;
  };

  showImagePage(id: string, e: ImageEventEnum) {
    const event = this.neighborEventFn(id, e);
    return {
      prev: {
        show: event.prev,
        item: event.item,
      },
      next: {
        show: event.next,
        item: event.item,
      },
    };
  }

  galleryTargetPageFn = (e: ImageEventEnum, id: string) => {
    const page = this.showImagePage(id, e),
      v = this.galleryTarget.videoName || false;
    if (e == ImageEventEnum.next && page.next.item) {
      this.galleryTarget = this.converter.Convert(page.next.item);
    } else if (e == ImageEventEnum.prev && page.prev.item) {
      this.galleryTarget = this.converter.Convert(page.prev.item);
    }
    /**视频下载按钮 */
    this.galleryTarget.videoName = v;
    this.galleryTarget.imgNext = page.next.show;
    this.galleryTarget.imgPrev = page.prev.show;
  };

  initGalleryTarget(event: MixedIntoEventRecord) {
    const page = this.showImagePage(event.EventId, ImageEventEnum.none);
    this.galleryTarget = this.converter.Convert(event);

    this.galleryTarget.imgNext = page.next.show;
    this.galleryTarget.imgPrev = page.prev.show;
  }

  enlargeImageSize = {
    width: 0,
    height: 0,
  };
}
