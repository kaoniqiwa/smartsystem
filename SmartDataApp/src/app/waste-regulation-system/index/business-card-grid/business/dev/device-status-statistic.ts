import { StatisticalDataBufferService } from "../../buffer/statistical-data-buffer";
import { DeviceStatus } from "./data";
import { BusinessParameter } from "../../../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
export class DeviceStatusStatistic extends BaseBusinessRefresh {
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
  }

  async getData() {
    const divisionId = this.businessParameter.divisionId;
    let model = new DeviceStatus();

    let data = await (
      this.dataServe as StatisticalDataBufferService
    ).getDivisionStatisticNumber(divisionId);
    model.cameraNumber = data.CameraNumber || 0;
    model.offlineCameraNumber = data.OfflineCameraNumber || 0;
    return model;
  }
}
