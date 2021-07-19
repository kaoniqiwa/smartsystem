import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import {
  GalleryTarget,
  ImageEventEnum,
} from "../../../../gallery-target/gallery-target";
import { GalleryTargetView } from "../../../event-history/gallery-target";
import { HWCameraImageUrl, TypeNameColorEnum } from "./camera-img-url";
export class GalleryTargetViewI extends GalleryTargetView {
  neighborEventFnI: (
    id: string,
    e: ImageEventEnum
  ) => {
    prev: boolean;
    next: boolean;
    item: HWCameraImageUrl;
  };

  showImagePageI(id: string, e: ImageEventEnum) {
    const event = this.neighborEventFnI(id, e);
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
    const page = this.showImagePageI(id, e),
      idV = id.split("&");

    if (e == ImageEventEnum.next && page.next.item) {
      const enlargeImage = AIOPMediumPictureUrl.getJPG(page.next.item.ImageUrl);
      this.galleryTarget = new GalleryTarget(
        null,
        null,
        enlargeImage,
        null,
        idV[0] + "&" + page.next.item.id,
        this.toDownLoadImgNameI(page.next.item)
      );
      this.galleryTarget.enlargeImageName = page.next.item.CameraName;
      this.galleryTarget.subName = {
        label: page.next.item.typeName,
        class: TypeNameColorEnum[page.next.item.imgType],
      };
    } else if (e == ImageEventEnum.prev && page.prev.item) {
      const enlargeImage = AIOPMediumPictureUrl.getJPG(page.prev.item.ImageUrl);
      this.galleryTarget = new GalleryTarget(
        null,
        null,
        enlargeImage,
        null,
        idV[0] + "&" + page.prev.item.id,
        this.toDownLoadImgNameI(page.prev.item)
      );
      this.galleryTarget.enlargeImageName = page.prev.item.CameraName;
      this.galleryTarget.subName = {
        label: page.prev.item.typeName,
        class: TypeNameColorEnum[page.prev.item.imgType],
      };
    }
    this.galleryTarget.imgNext = page.next.show;
    this.galleryTarget.imgPrev = page.prev.show;
  };

  initGalleryTargetI(
    eventId: string,
    cameras: Array<HWCameraImageUrl>,
    index: number
  ) {
    if (cameras && cameras.length) {
      for (let i = 0; i < cameras.length; i++) cameras[i].id = i + "";
      const enlargeImage = AIOPMediumPictureUrl.getJPG(cameras[index].ImageUrl),
        ids = new Array();
      cameras.map((x) => ids.push(x.id));
      this.galleryTarget = new GalleryTarget(
        null,
        null,
        enlargeImage,
        null,
        eventId + "&" + cameras[index].id,
        this.toDownLoadImgNameI(cameras[index])
      );
      this.galleryTarget.imgNext = index + 1 < cameras.length;
      this.galleryTarget.imgPrev = index > 0;
      this.galleryTarget.enlargeImageName = cameras[index].CameraName;
      this.galleryTarget.subName = {
        label: cameras[index].typeName,
        class: TypeNameColorEnum[cameras[index].imgType],
      };
    }
  }

  toDownLoadImgNameI(item: HWCameraImageUrl) {
    var name = "";
    name += item.CameraName + "_" + item.typeName;
    // name += this.datePipe.transform(item, 'yyyy年MM月dd日 hh点mm分') + ' ';
    return name;
  }
}
