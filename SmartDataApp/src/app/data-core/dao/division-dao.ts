import { DivisionRequestService } from "../../data-core/repuest/division.service"; 
import { GetDivisionsParams } from "../model/waste-regulation/division";
import { ListAttribute } from "../../common/tool/table-form-helper";

export class DivisionDao extends ListAttribute{
    constructor(private requestService:DivisionRequestService){
super();
    }

    async allDivisions() {
        const param = new GetDivisionsParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const result = await this.requestService.list(param).toPromise();
        return result.Data;
    }
}