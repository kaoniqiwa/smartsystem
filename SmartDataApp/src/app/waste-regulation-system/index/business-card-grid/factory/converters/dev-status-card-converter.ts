import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import { Percentage } from "src/app/common/tool/tool.service";
import { OnlineStatus } from "src/app/data-core/model/enum";
import { ColorEnum } from "src/app/shared-module/card-component/card-content-factory";
import {
  Arc,
  StateScale,
} from "src/app/shared-module/card-component/state-scale-card/state-scale";
import { DeviceStatus } from "../../business/dev/data";

export class DevStatusCardConverter implements IConverter {
  Convert<DeviceStatus, ViewsModel>(
    input: DeviceStatus,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: DeviceStatus,
    output: ViewsModel<StateScale>
  ): ViewsModel<StateScale> {
    output.views = [new StateScale()];
    output.pageSize = 1;
    output.pageIndex = 1;
    output.views[0].title = "设备运行状态";
    if (input instanceof DeviceStatus) {
      const percent = Percentage(
          input.cameraNumber - input.offlineCameraNumber,
          input.cameraNumber
        ),
        level = (percent: number) => {
          if (percent > 90) return "正常";
          else if (percent >= 80 && percent < 90) return "中度";
          else return "严重";
        },
        arcVal = (percent: number) => {
          if (percent == 100) return Arc._100;
          else if (percent == 0) return Arc._0;
          else if (percent >= 80 && percent < 100) return Arc._80;
          else if (percent >= 30 && percent < 80) return Arc._40;
          else if (percent < 30) return Arc._20;
        };
      enum StateColorEnum {
        "正常" = "green-text",
        "中度" = "orange-text",
        "严重" = "powder-red-text",
      }
      output.views[0].arc = arcVal(percent);
      output.views[0].stateLabel = {
        subTitle: "系统设备在线比",
        scaleNumber: percent + "",
        state: level(percent),
        color: StateColorEnum[level(percent)],
      };
      output.views[0].detail.push({
        label: "全部设备数量",
        number: input.cameraNumber + "",
        color: ColorEnum["sky-blue-text2"],
        tag: undefined,
        linkTipLabel: "查看全部设备信息",
      });
      output.views[0].detail.push({
        label: "在线设备数量",
        number: input.cameraNumber - input.offlineCameraNumber + "",
        color: ColorEnum["green-text"],
        tag: OnlineStatus.Online,
        linkTipLabel: "查看在线设备信息",
      });
      output.views[0].detail.push({
        label: "离线设备数量",
        number: input.offlineCameraNumber + "",
        color: ColorEnum["powder-red-text"],
        tag: OnlineStatus.Offline,
        linkTipLabel: "查看离线设备信息",
      });
    }
    return output;
  }
}
