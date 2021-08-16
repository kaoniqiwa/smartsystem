import { Injectable } from "@angular/core";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";

@Injectable()
export class DivisionManageService {
  constructor(private _divisionRequestService: DivisionRequestService) {}

  async addDivision(divison: Division) {
    let res = await this._divisionRequestService.create(divison);
    return res;
  }
  async deleteDivision(divisionId: string) {
    let res = await this._divisionRequestService.del(divisionId);
    return res;
  }
  async editDivision(divison: Division) {
    let res = await this._divisionRequestService.set(divison);
    return res;
  }
}
