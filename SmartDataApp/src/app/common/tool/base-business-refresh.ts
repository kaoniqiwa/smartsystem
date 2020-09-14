/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/7
 */

import { IBusinessRefresh, BusinessParameter } from "../interface/IBusiness";
import { IBusinessData } from "../interface/IBusiness";
import { AutoRefreshTimeSpan } from "../interface/IBusiness";
import { IBusinessService } from "../interface/IDataBuffer";
export class BaseBusinessRefresh implements IBusinessRefresh{

    businessParameter: BusinessParameter;
    dataServe: IBusinessService;
    dataChanged: (data: IBusinessData) => void;
    timeSpan: AutoRefreshTimeSpan;
    disposing: (self: this) => void;
    constructor(dataServe: IBusinessService, businessParameter?: BusinessParameter) {
        this.timeSpan = new AutoRefreshTimeSpan(); 
        this.timeSpan.nextRefreshTime = new Date();
        this.dataServe = dataServe;
        this.businessParameter = businessParameter; 
        this.timeSpan.timeElasped = () => {
            this.timeElasped();
        };
    }


    async   timeElasped() {
        if (this.dataChanged) {
            const data = await this.getData();
            if(data)this.dataChanged(data);
        }
    }

    ngOnDestroy(): void { 
        if (this.disposing) this.disposing(this);
    }

    async  getData(): Promise<IBusinessData> {
        return null;
    }

}