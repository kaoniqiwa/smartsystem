
import { StatisticalDataBufferService, TimeUnitEnum } from '../../buffer/statistical-data-buffer';
import { Divisions, Division } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh"; 
export class DivisionList extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() { 
        let model = new Divisions();
        model.items = new Array();
        let data = await (this.dataServe as StatisticalDataBufferService).getDivisions();
        for (const d of data) {
            const _ = new Division();
            _.id = d.Id;
            _.name = d.Name;
            _.divisionType = d.DivisionType;
            _.parentId=d.ParentId;
            model.items.push(_);
        }
        return model;
    }
}