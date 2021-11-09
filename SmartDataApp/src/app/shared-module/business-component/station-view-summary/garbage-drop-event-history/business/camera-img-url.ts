import { CameraImageUrl } from "../../../../../data-core/model/waste-regulation/event-record";

export class HWCameraImageUrl extends CameraImageUrl {
  id: string;
  imgType: ImgTypeEnum;
  typeName: TypeNameEnum;
}

export enum ImgTypeEnum {
  drop = "drop",
  handle = "handle",
  timeOut = "timeOut",
}

export enum TypeNameEnum {
  drop = "垃圾滞留",
  handle = "已处置",
  timeOut = "超时未处置",
}

export enum TypeNameColorEnum {
  drop = "sky-blue-text2",
  handle = "orange-text",
  timeOut = "powder-red-text",
}
