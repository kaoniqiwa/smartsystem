
import { StatisticalDataBufferService, TimeUnitEnum } from '../../buffer/statistical-data-buffer';
import { Divisions, Division } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh"; 
export class DivisionList extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() { 
        const divisionId = this.businessParameter.map.get('divisionId') as string;
        const model = new Divisions();  
        model.items = new Array();
        const ancestorDivisions = await (this.dataServe as StatisticalDataBufferService).ancestorDivisions(divisionId)
        , divisions = await (this.dataServe as StatisticalDataBufferService).ancestorDivisions(null,divisionId);
        ancestorDivisions.push(divisions.pop());
        for (const d of ancestorDivisions) {
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