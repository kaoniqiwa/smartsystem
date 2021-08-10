import { AiopCamera } from "src/app/data-core/model/aiop/camera";
import { CameraUsage, OnlineStatus } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";

enum FormState {
  none = 0,
  create = 1,
  edit = 2,
}
enum FormOperate {
  submit = 0,
  cancel = 1,
}
interface FormField {
  Name: string;
  StationType: number;
}
interface FormDatas {
  station?: GarbageStation;
  state: FormState;
  cameras?: AiopCamera[];
}
interface FormResult {
  data?: FormDatas;
  operate: FormOperate;
}

interface CameraTableField {
  id: string;
  name: string;
  cameraType: string;
  encodeDevice: string;
}
interface CameraTableFiled2 {
  id: string;
  name?: string;
  onlineStatus?: OnlineStatus;
  cameraUsage?: CameraUsage;
}
export {
  FormField,
  FormResult,
  FormOperate,
  FormState,
  CameraTableField,
  FormDatas,
  CameraTableFiled2,
};
