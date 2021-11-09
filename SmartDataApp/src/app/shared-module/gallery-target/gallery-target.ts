import { EventDataObject } from "../../data-core/model/waste-regulation/event-data-object";

export class GalleryTarget<T = any> {
  data: T;
  enlargeId: string;
  enlargeConfidence: string;
  enlargeImage: string;
  enlargeImageName: string;
  subName: { label: string; class: string };
  polygon: EventDataObject[];
  id: string;
  downloadImgName: string;
  videoName: boolean;
  imgPrev: boolean;
  imgNext: boolean;
  /**刷新 图片加载标记 */
  refreshImg: {
    state: boolean;
  };
  constructor(
    enlargeId: string,
    confidence: string,
    imgSrc: string,
    polygon: EventDataObject[],
    id: string,
    downloadImgName: string
  ) {
    this.enlargeId = enlargeId;
    this.enlargeConfidence = confidence;
    this.enlargeImage = imgSrc;
    this.id = id;
    this.polygon = polygon;
    this.imgNext = true;
    this.imgPrev = true;
    this.downloadImgName = downloadImgName;
    this.videoName = false;
    this.enlargeImageName = "详细图片";
  }
}

export enum ImageEventEnum {
  prev,
  next,
  none,
}
