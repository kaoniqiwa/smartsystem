import { DatePipe } from "@angular/common";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
import {
  GarbageFullEventRecord,
  CameraImageUrl,
} from "../../../../../data-core/model/waste-regulation/garbage-full-event-record";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import {
  GalleryTarget,
  ImageEventEnum,
} from "../../../../gallery-target/gallery-target";

export class GalleryTargetView {
  galleryTarget: GalleryTarget;
  galleryTargetBox = false;

  constructor(public datePipe: DatePipe) {}

  neighborEventFn: (
    id: string,
    e: ImageEventEnum
  ) => {
    prev: boolean;
    next: boolean;
    item: GalleryTargetItem;
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
    const page = this.showImagePage(id, e);

    if (e == ImageEventEnum.next && page.next.item) {
      const enlargeImage = ResourceMediumRequestService.getJPG(
        page.next.item.other.ImageUrl
      );
      this.galleryTarget = new GalleryTarget(
        null,
        null,
        enlargeImage,
        null,
        page.next.item.other.CameraId + "&" + page.next.item.event.EventId,
        this.toDownLoadImgName(page.next.item.event)
      );
    } else if (e == ImageEventEnum.prev && page.prev.item) {
      const enlargeImage = ResourceMediumRequestService.getJPG(
        page.next.item.other.ImageUrl
      );
      this.galleryTarget = new GalleryTarget(
        null,
        null,
        enlargeImage,
        null,
        page.prev.item.other.CameraId + "&" + page.prev.item.event.EventId,
        this.toDownLoadImgName(page.prev.item.event)
      );
    }
    this.galleryTarget.imgNext = page.next.show;
    this.galleryTarget.imgPrev = page.prev.show;
    this.galleryTarget.videoName = true;
  };

  initGalleryTarget(event: GarbageFullEventRecord, index: number) {
    if (event && event.Data && event.Data.CameraImageUrls) {
      const enlargeImage = ResourceMediumRequestService.getJPG(
        event.Data.CameraImageUrls[index].ImageUrl
      );
      this.galleryTarget = new GalleryTarget(
        null,
        null,
        enlargeImage,
        null,
        event.Data.CameraImageUrls[index].CameraId + "&" + event.EventId,
        this.toDownLoadImgName(event)
      );
      this.galleryTarget.imgNext =
        index + 1 < event.Data.CameraImageUrls.length;
      this.galleryTarget.imgPrev = index > 0;
    }
  }

  toDownLoadImgName(item: GarbageFullEventRecord) {
    var name = "";
    name += item.ResourceName + " ";
    name +=
      this.datePipe.transform(item.EventTime, "yyyy年MM月dd日 hh点mm分") + " ";
    return name;
  }
}

export class GalleryTargetItem {
  event: GarbageFullEventRecord;
  other: CameraImageUrl;
}
