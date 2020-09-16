
import { StatisticalDataBufferService, TimeUnitEnum } from '../../buffer/statistical-data-buffer'; 
import {  Specification } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
import { EventNumber } from '../../../../../data-core/model/waste-regulation/event-number';
import { EventTypeEnum } from '../../../../../common/tool/enum-helper'
export class DivisionGarbageSpecification   extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() {
        const divisionsId = this.businessParameter.map.get('divisionsId');
        let model = new Specification();
       
        let data = await (this.dataServe as StatisticalDataBufferService).getDivisionStatisticNumber(divisionsId);
        model.fullPushNumber=0;
        model.garbageBarrelNumber=data.TrashCanNumber;
        model.garbagePushNumber=data.StationNumber;
        model.hybridPushNumber=0;
        model.illegalDropNumber=0;
        return model;
    }
}