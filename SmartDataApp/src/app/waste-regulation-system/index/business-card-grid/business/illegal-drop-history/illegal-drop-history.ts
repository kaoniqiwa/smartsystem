
import { StatisticalDataBufferService, TimeUnitEnum } from '../../buffer/statistical-data-buffer'; 
import { IllegalDropEvent } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
import { EventNumber } from '../../../../../data-core/model/waste-regulation/event-number';
import { EventTypeEnum } from '../../../../../common/tool/enum-helper'
export class IllegalDropHistory  extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() {
        const divisionsId = this.businessParameter.map.get('divisionsId');
        let model = new IllegalDropEvent();
        model.datas = new Array();
        
        let data = await (this.dataServe as StatisticalDataBufferService).getDivisionEventNumbers(divisionsId, TimeUnitEnum.Hour);
        for (var x of data) {
            for (const y of x.EventNumbers) 
                if (y.EventType == EventTypeEnum.IllegalDrop)
                    model.datas.push(y);            
        }
        return model;
    }
}