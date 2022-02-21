import {
  GalleryTarget,
  ImageEventEnum,
} from "../../../gallery-target/gallery-target";
import { GalleryTargetView } from "../../event-history/gallery-target";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { CameraPictureUrl } from "../../../../data-core/model/waste-regulation/camera-picture-url";
import { ResourceMediumRequestService } from "../../../../data-core/repuest/resources.service";
export class GalleryTargetViewI extends GalleryTargetView {
  /**抓图 */
  manualCaptureFn: (
    stationId: string,
    cb: (cameraPictureUrl: CameraPictureUrl[]) => {
      old: string;
      new: string;
    }
  ) => void;

  initGalleryTargetI(camera: Camera) {
    if (camera) {
      const enlargeImage = ResourceMediumRequestService.getJPG(camera.ImageUrl);
      this.galleryTarget = new GalleryTarget(
        null,
        null,
        enlargeImage,
        null,
        camera.GarbageStationId + "&" + camera.Id,
        this.toDownLoadImgNameI(camera)
      );
      this.galleryTarget.imgNext = false;
      this.galleryTarget.imgPrev = false;
      if (this.manualCaptureFn) {
        this.manualCaptureFn(camera.GarbageStationId, (urls) => {
          var obj = {
            old: camera.ImageUrl,
            new: "",
          };
          urls.map((x) => {
            if (x.CameraId == camera.Id) {
              obj.new = ResourceMediumRequestService.getJPG(x.Id);
              this.galleryTarget.enlargeImage =
                ResourceMediumRequestService.getJPG(x.Id);
              this.galleryTarget.refreshImg.state = false;
            }
          });
          return obj;
        });
        this.galleryTarget.refreshImg = {
          state: true,
        };
      }
    }
  }

  toDownLoadImgNameI(item: Camera) {
    var name = "";
    name += item.Name + " ";
    name +=
      this.datePipe.transform(item.UpdateTime, "yyyy年MM月dd日 hh点mm分") + " ";
    return name;
  }
  enlargeImageSize = {
    width: 0,
    height: 0,
  };
}
