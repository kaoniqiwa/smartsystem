import { Language } from "src/app/common/tool/language";
import { CameraImageUrl } from "../../../../../data-core/model/waste-regulation/event-record";

export class HWCameraImageUrl extends CameraImageUrl {
  id: string;
  imgType: ImgTypeEnum;
  typeName: string;
}

export enum ImgTypeEnum {
  drop = "drop",
  timeOut = "timeOut",
  handle = "handle",
}

export class TypeNameEnum {
  static drop = "垃圾滞留";
  static handle = Language.json.did + Language.json.handle;
  static timeOut = "超时未处置";
}

export enum TypeNameColorEnum {
  drop = "sky-blue-text2",
  handle = "orange-text",
  timeOut = "powder-red-text",
}
