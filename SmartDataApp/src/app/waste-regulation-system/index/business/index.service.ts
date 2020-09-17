import { Injectable } from "@angular/core";
import { StatisticalDataBufferService } from "../business-card-grid/buffer/statistical-data-buffer";

import { DivisionTypeEnum } from "../../../common/tool/enum-helper";
import { Division } from "../../../data-core/model/waste-regulation/division";
@Injectable()
export class IndexService {
    constructor(private bufferService: StatisticalDataBufferService) {

    }

    async getCounty() {
        const divisions = await this.bufferService.getDivisions();
        const countys = divisions.filter(x => x.DivisionType == DivisionTypeEnum.County);
        return countys.shift();
    }

    async getCommittees() {
        const divisions = await this.bufferService.getDivisions();
        const committees = divisions.filter(x => x.DivisionType == DivisionTypeEnum.Committees);
        return committees;
    }

   async getCommittesIds(){
        const committees=await this.getCommittees(),ids = new Array<string>();
        for(const x of committees)
            ids.push(x.Id);
        return ids;
    }
}