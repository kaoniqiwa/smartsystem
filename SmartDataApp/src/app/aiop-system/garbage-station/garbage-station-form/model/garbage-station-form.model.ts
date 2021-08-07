import { Camera } from "src/app/data-core/model/aiop/camera.model";

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
  /**平台名称(可选) */
  Name: string;
  /**类型 */
  StationType: number;
}
interface FormResult {
  data?: FormField;
  operate: FormOperate;
  cameras?: Camera[];
}

interface CameraTableField {
  id: string;
  name: string;
  cameraType: string;
  cameraState?: string;
  encodeDevice: string;
  channelNo: string;
}
export { FormField, FormResult, FormOperate, FormState, CameraTableField };
