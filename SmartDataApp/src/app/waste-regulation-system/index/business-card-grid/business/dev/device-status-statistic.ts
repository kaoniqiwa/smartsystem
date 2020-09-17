
import { StatisticalDataBufferService, TimeUnitEnum } from '../../buffer/statistical-data-buffer'; 
import { DeviceStatus } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
import { EventNumber } from '../../../../../data-core/model/waste-regulation/event-number';
import { EventTypeEnum } from '../../../../../common/tool/enum-helper'
export class DeviceStatusStatistic   extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() {
        const divisionsId = this.businessParameter.map.get('divisionsId');
        let model = new DeviceStatus();
       
        let data = await (this.dataServe as StatisticalDataBufferService).getDivisionStatisticNumber(divisionsId); 
        model.cameraNumber=data.CameraNumber||0;
        model.offlineCameraNumber=data.OfflineCameraNumber||0;
        return model;
    }
}